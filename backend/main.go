package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"text/template"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

// User struct holds user data
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

// Order struct holds order data
type Order struct {
	ID             int    `json:"id"`
	PickupLocation string `json:"pickup_location"`
	DropoffLocation string `json:"dropoff_location"`
	PackageDetails string `json:"package_details"`
	DeliveryTime   string `json:"delivery_time,omitempty"`
	UserID         int    `json:"user_id"`
	Status         string `json:"status"`
	CourierID      int    `json:"courier_id,omitempty"`
	CreatedAt      string    `json:"created_at"` 
	UpdatedAt      string    `json:"updated_at"` 
}

// dbConn creates and returns a connection to the database
func dbConn() (db *sql.DB) {
	dbDriver := "mysql"
	dbUser := "root"
	dbPass := "root"
	dbName := "tools"
	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@/"+dbName)
	if err != nil {
		log.Fatal("Database connection error: ", err)
	}
	return db
}

// tmpl holds parsed templates
var tmpl = template.Must(template.ParseGlob("form/*"))

// main starts the HTTP server and defines routes
func main() {
	log.Println("Server started on: http://localhost:4300")
	http.HandleFunc("/register", handleCORS(Register))
	http.HandleFunc("/login", handleCORS(Login))
	http.HandleFunc("/create-order", handleCORS(CreateOrder)) // New endpoint for order creation

	http.HandleFunc("/get-user-orders", handleCORS(GetUserOrders)) // New endpoint for getting user orders
	http.HandleFunc("/get-order-details", handleCORS(GetOrderDetails)) // New endpoint for getting order details



	log.Fatal(http.ListenAndServe(":4300", nil))
}

// handleCORS middleware to handle CORS
func handleCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	}
}

// Register handles user registration
func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		db := dbConn()
		defer db.Close()

		if user.Username == "" || user.Password == "" || user.Email == "" || user.Phone == "" {
			http.Error(w, "All fields are required", http.StatusBadRequest)
			return
		}

		var id int
		err = db.QueryRow("SELECT id FROM users WHERE username=?", user.Username).Scan(&id)
		if err == nil {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}

		err = db.QueryRow("SELECT id FROM users WHERE email=?", user.Email).Scan(&id)
		if err == nil {
			http.Error(w, "Email already exists", http.StatusConflict)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		insForm, err := db.Prepare("INSERT INTO users(username, password, email, phone) VALUES(?, ?, ?, ?)")
		if err != nil {
			http.Error(w, "Error preparing query", http.StatusInternalServerError)
			return
		}
		_, err = insForm.Exec(user.Username, hashedPassword, user.Email, user.Phone)
		if err != nil {
			http.Error(w, "Error creating user", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Login handles user login
func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		email := user.Email
		password := user.Password

		if email == "" || password == "" {
			http.Error(w, "Email and password are required", http.StatusBadRequest)
			return
		}

		db := dbConn()
		defer db.Close()

		var storedUser User
		err = db.QueryRow("SELECT id, password FROM users WHERE email=?", email).Scan(&storedUser.ID, &storedUser.Password)
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// CreateOrder handles new order creation
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var order Order

		err := json.NewDecoder(r.Body).Decode(&order)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// Check for required fields
		if order.PickupLocation == "" || order.DropoffLocation == "" || order.PackageDetails == "" || order.UserID == 0 {
			http.Error(w, "Missing required fields", http.StatusBadRequest)
			return
		}

		db := dbConn()
		defer db.Close()

		// Updated query to match `order` table schema
		insForm, err := db.Prepare("INSERT INTO `orders` (pickup_location, dropoff_location, package_details, delivery_time, user_id, status) VALUES (?, ?, ?, ?, ?, ?)")
		if err != nil {
			http.Error(w, "Error preparing query", http.StatusInternalServerError)
			return
		}
		defer insForm.Close()

		// Set default order status to "Pending"
		order.Status = "Pending"

		// Execute query
		_, err = insForm.Exec(order.PickupLocation, order.DropoffLocation, order.PackageDetails, order.DeliveryTime, order.UserID, order.Status)
		if err != nil {
			http.Error(w, "Error creating order", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "Order created successfully"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}



// GetUserOrders handles fetching orders for a specific user
func GetUserOrders(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		// Assuming the user ID is provided as a query parameter for simplicity
		// Alternatively, retrieve it from an authentication token or session
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "User ID is required", http.StatusBadRequest)
			return
		}

		db := dbConn()
		defer db.Close()

		// Query to fetch all orders for the specified user
		rows, err := db.Query("SELECT order_id, pickup_location, dropoff_location, package_details, delivery_time, status, courier_id, created_at, updated_at FROM `orders` WHERE user_id = ?", userID)
		if err != nil {
			http.Error(w, "Error fetching orders", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var orders []Order

		// Loop through rows and scan each order's data into an Order struct
		for rows.Next() {
			var order Order
			var deliveryTime sql.NullString // Use NullString to handle nullable timestamps
			var courierID sql.NullInt64     // Use NullInt64 to handle nullable courier_id

			err := rows.Scan(
				&order.ID, &order.PickupLocation, &order.DropoffLocation,
				&order.PackageDetails, &deliveryTime, &order.Status,
				&courierID, &order.CreatedAt, &order.UpdatedAt,
			)
			if err != nil {
				http.Error(w, "Error scanning order data", http.StatusInternalServerError)
				return
			}

			// Handle nullable fields
			if deliveryTime.Valid {
				order.DeliveryTime = deliveryTime.String
			}
			if courierID.Valid {
				order.CourierID = int(courierID.Int64)
			}

			orders = append(orders, order)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error processing rows", http.StatusInternalServerError)
			return
		}

		// Return orders as JSON
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(orders)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}




// GetOrderDetails handles fetching detailed information for a specific order
func GetOrderDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		orderID := r.URL.Query().Get("order_id")
		if orderID == "" {
			http.Error(w, "Order ID is required", http.StatusBadRequest)
			return
		}

		db := dbConn()
		defer db.Close()

		var order Order
		err := db.QueryRow("SELECT order_id, pickup_location, dropoff_location, package_details, status ,  created_at, updated_at FROM `orders` WHERE order_id = ?", orderID).Scan(
			&order.ID,
			&order.PickupLocation,
			&order.DropoffLocation,
			&order.PackageDetails,
			&order.Status,
			&order.CreatedAt,
			&order.UpdatedAt,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Order not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Error fetching order details", http.StatusInternalServerError)
			return
		}

		// Return order details as JSON
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(order)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
