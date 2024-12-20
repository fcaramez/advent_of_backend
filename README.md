### **Backend Coding Challenge: Task Management System**

### **Disclaimer**

This coding challenge was generated by chatGPT and for training and practicing purposes

#### **Objective**

Build a RESTful API for a **Task Management System** where users can create, update, delete, and retrieve tasks. Tasks can be assigned to users, organized into projects, and filtered based on status or due dates.

---

### **Requirements**

#### **Core Features**

1. **User Management**:

   - Users can register and log in using email and password.
   - Use JWT (JSON Web Tokens) for authentication.
   - Users should be able to update their profile.

2. **Task Management**:

   - CRUD (Create, Read, Update, Delete) operations for tasks.
   - A task should have the following attributes:
     - Title (string, required)
     - Description (string, optional)
     - Status (enum: `Pending`, `In Progress`, `Completed`, default: `Pending`)
     - Due Date (date, optional)
     - Assigned User (optional)
   - Tasks should belong to projects.

3. **Project Management**:

   - CRUD operations for projects.
   - A project should have the following attributes:
     - Name (string, required)
     - Description (string, optional)
     - Owner (the user who created it)
   - Only the owner of the project can delete it.

4. **Task Filters**:
   - Allow filtering tasks by:
     - Status (`Pending`, `In Progress`, `Completed`)
     - Due Date (overdue, today, or future)
     - Assigned User
   - Allow sorting tasks by `due date` or `status`.

#### **Additional Requirements**

1. **API Documentation**:

   - Use a tool like Swagger/OpenAPI to document your API.

2. **Error Handling**:

   - Proper error messages and status codes for invalid requests.

3. **Database**:

   - Use any relational database (e.g., PostgreSQL, MySQL). Include schema definitions and migrations.

4. **Security**:

   - Ensure proper validation and sanitization of input.
   - Protect endpoints with authentication where needed.

5. **Testing**:
   - Write unit and/or integration tests for at least the core functionality (e.g., user authentication, task creation).

#### **Bonus Points**

1. Implement role-based permissions (e.g., Admin, Member) for projects.
2. Add WebSocket support for real-time task updates (e.g., when a task is assigned or updated).
3. Deploy your application to a platform like Heroku, AWS, or Vercel.

---

### **Technical Requirements**

- **Programming Language**: Use one of the following: Python (Django/Flask), Node.js (Express), Ruby (Rails), Java (Spring Boot), or similar backend framework.
- **Database**: Relational DB (PostgreSQL/MySQL).
- **Version Control**: Use Git and provide a link to a public repository (e.g., GitHub).
- **Readme**: Include a `README.md` file with:
  - How to set up and run the project locally.
  - An explanation of the project structure.
  - Any assumptions or trade-offs made.

---

### **Evaluation Criteria**

1. Code quality: readability, organization, and adherence to best practices.
2. Architecture: modularity, scalability, and maintainability.
3. API design: clarity, RESTful principles, and documentation.
4. Testing: extent and quality of test coverage.
5. Bonus features: if any are implemented.

---

### **Deliverables**

1. A GitHub repository link containing your project code.
2. Instructions on how to set up and test the application locally.
3. (Optional) A deployed link to the live application.

---

This challenge evaluates key backend developer skills like API design, database modeling, authentication, and testing while providing room for creativity and demonstrating a practical approach to development.
