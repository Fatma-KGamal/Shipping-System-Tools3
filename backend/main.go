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

// User struct which holds user data
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
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

// tmpl hold parsed templates
var tmpl = template.Must(template.ParseGlob("form/*"))

// start the HTTP server and defines routes
func main() {
	log.Println("Server started on: http://localhost:4300")
	http.HandleFunc("/register", handleCORS(Register))
	http.HandleFunc("/login", handleCORS(Login))

	log.Fatal(http.ListenAndServe(":4300", nil))
}

// Middleware to handle CORS
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

// register user function

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		// Decode the JSON request body into a User struct
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		db := dbConn()
		defer db.Close()

		// Check that all required fields are provided
		if user.Username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}
		if user.Password == "" {
			http.Error(w, "Password is required", http.StatusBadRequest)
			return
		}
		if user.Email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}
		if user.Phone == "" {
			http.Error(w, "Phone is required", http.StatusBadRequest)
			return
		}

		var id int

		// Check if username exists in the database
		err = db.QueryRow("SELECT id FROM users WHERE username=?", user.Username).Scan(&id)
		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "Error checking username", http.StatusInternalServerError)
			return
		}
		if err == nil {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}

		// Check if email exists in the database
		err = db.QueryRow("SELECT id FROM users WHERE email=?", user.Email).Scan(&id)
		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "Error checking email", http.StatusInternalServerError)
			return
		}
		if err == nil {
			http.Error(w, "Email already exists", http.StatusConflict)
			return
		}

		// Hash the password before saving
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		// Add new user to the database with hashed password
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

// login user function

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User

		// Decode the JSON request body into a User struct
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			response, _ := json.Marshal(map[string]string{"error": "Invalid request payload"})
			http.Error(w, string(response), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		email := user.Email
		password := user.Password

		// Check if email and password are provided
		if email == "" {
			response, _ := json.Marshal(map[string]string{"error": "Email is required"})
			w.WriteHeader(http.StatusBadRequest)
			w.Write(response)
			return
		}

		if password == "" {
			response, _ := json.Marshal(map[string]string{"error": "Password is required"})
			w.WriteHeader(http.StatusBadRequest)
			w.Write(response)
			return
		}

		db := dbConn()
		defer db.Close()

		var storedUser User

		// Get user by email from the database
		err = db.QueryRow("SELECT id, password FROM users WHERE email=?", email).Scan(&storedUser.ID, &storedUser.Password)
		if err != nil {
			response, _ := json.Marshal(map[string]string{"error": "User not found"})
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(response)
			return
		}

		// Compare the hashed password with the provided password
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
		if err != nil {
			response, _ := json.Marshal(map[string]string{"error": "Invalid credentials"})
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(response)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
