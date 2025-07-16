# Admin panel Sibers

### Before launching, you need to:
1. Go to "cd frontend/", then write "npm install"
2. Go to "cd backend/", then write "npm install"
3. To set up a connection to the database, you need to go to "/backend/db.js"

### To launch the application, you need to:
1. Go to "cd frontend/", then write "npm start"
2. Go to "cd backend/", then write "npm start"
_After launching, the site will be launched on port :3000, and the server on port :3500_

### Project structure
admin-panel-sibers/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── checkRoleMiddleware.js
│   ├── models/
│   │   ├── models.js
│   ├── routers/
│   │   ├── authRoute.js
│   │   ├── index.js
│   │   └── showRoute.js
│   ├── db.js
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   ├── adminStyle.css
│   │   │   ├── loginStyle.css
│   │   │   └── userStyle.css
│   │   ├── js/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   └── user.js
│   │   ├── admin.html
│   │   ├── index.html
│   │   └── user.html
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── Readme.md
└── Sibers.sql

### How the application works:
_1. The initial window where the user is asked to log in._
_2. Then, if the authorization is successful, the user is transferred to the "Admin panel" (/admin). If the user has the "ADMIN" role, then he will be shown all the users that exist in the database. He will also be able to add a user._
_2.1 If the user does not have access (has the "USER" role), then he will have an empty admin panel, where he will not be able to perform any actions and requests to the server_
_3. Also, if the authorization was carried out from the "ADMIN" role, then the "view" button will be available, which redirects to the "/user" route, where you can view detailed data about him. You can also change the user data or completely remove him from the list._

### Admin data:
_login: admin_
_password: admin123_

### User and DB data:
('tech_guy', 'SecurePass123!', 'Дмитрий', 'Технов', 'M', '1990-08-12'),
('web_designer', 'Design@2023', 'Ольга', 'Вебова', 'F', '1993-04-25'),
('data_scientist', 'Data$cience1', 'Артем', 'Аналитиков', 'M', '1985-11-30'),
('dev_ops', 'Deploy#2024', 'Сергей', 'Серверов', 'M', '1991-07-18'),
('ux_master', 'UserXp*2023', 'Алина', 'Интерфейсова', 'F', '1994-02-09'),
('sys_admin', 'RootAccess!1', 'Павел', 'Администраторов', 'M', '1988-09-15')

### Technologies:
_backend - Express.js, JS, Sequelize, Mysql, JWT, Bcrypt_
_frontend - Express.js, JS, HTML, CSS_