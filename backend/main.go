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

// User struct represents the structure of a user in the system
type User struct {
	ID       int    `json:"id"`       // ID is the unique identifier for a user
	Username string `json:"username"` // Username is the user's chosen username
	Password string `json:"password"` // Password stores the user's password
	Email    string `json:"email"`    // Email stores the user's email
	Phone    string `json:"phone"`    // Phone stores the user's phone number
}

// dbConn creates and returns a connection to the database
func dbConn() (db *sql.DB) {
	dbDriver := "mysql"                                          // MySQL driver
	dbUser := "root"                                             // Database username
	dbPass := "root"                                             // Database password
	dbName := "tools"                                            // Database name
	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@/"+dbName) // Open a new connection
	if err != nil {
		panic(err.Error()) // Panic if there's an error during the connection
	}
	return db // Return the database connection
}

// tmpl is a variable to hold parsed templates
var tmpl = template.Must(template.ParseGlob("form/*"))

// main function starts the HTTP server and defines routes
func main() {
	log.Println("Server started on: http://localhost:4300")
	http.HandleFunc("/register", handleCORS(Register)) // Route for user registration, with CORS support
	http.HandleFunc("/login", handleCORS(Login))       // Route for user login, with CORS support

	log.Fatal(http.ListenAndServe(":4300", nil)) // Start server and listen on port 4300
}

// Middleware to handle CORS
func handleCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Allow CORS for specific origin (you can change this to your frontend URL)
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {

			// Handle preflight request for CORS
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r) // Call the next handler if not OPTIONS method
	}
}

// Register function handles user registration
func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		// Decode the JSON request body into a User struct
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		db := dbConn()   // Establish database connection
		defer db.Close() // Ensure connection is closed after function ends

		// Check if the username already exists in the database
		var existingUser User
		err = db.QueryRow("SELECT id FROM users WHERE username=?", user.Username).Scan(&existingUser.ID)
		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "Error checking for duplicate username", http.StatusInternalServerError)
			return
		}

		// If the user ID is found, that means the username is taken
		if existingUser.ID != 0 {
			// Username already exists
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}

		// Hash the password before saving
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		// Insert new user into the database with hashed password
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
		// Respond with a success message upon successful registration
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
	} else {

		// If the method is not POST, return a 405 Method Not Allowed error
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Login function handles user login
func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		// Decode the JSON request body into a User struct
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Debug log to check the received user data
		log.Printf("Received user: %+v\n", user)

		//username := user.Username
		email := user.Email
		password := user.Password

		// Check if username or password is empty
		if email == "" || password == "" {
			response, _ := json.Marshal(map[string]string{"error": "Email and Password must not be empty"})
			w.WriteHeader(http.StatusBadRequest) // Bad request for empty fields
			w.Write(response)                    // Write the JSON response
			return
		}

		db := dbConn() // Establish database connection
		defer db.Close()

		var storedUser User

		// Query the database for the user by username and get the stored hashed password
		err = db.QueryRow("SELECT id, password FROM users WHERE email=?", email).Scan(&storedUser.ID, &storedUser.Password)
		if err != nil {
			response, _ := json.Marshal(map[string]string{"error": "User not found"})
			w.WriteHeader(http.StatusUnauthorized) // Set the status code
			w.Write(response)                      // Write the JSON response
			return
		}

		// Debug log for the stored hashed password
		log.Printf("Stored hashed password: %s\n", storedUser.Password)

		// Compare the hashed password with the provided password
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
		if err != nil {
			response, _ := json.Marshal(map[string]string{"error": "Invalid credentials"})
			w.WriteHeader(http.StatusUnauthorized) // Set the status code
			w.Write(response)                      // Write the JSON response
			return
		}

		// If login is successful, return success message
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
	} else {
		// If the method is not POST, return a 405 Method Not Allowed error
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
