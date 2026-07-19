# Authentication
- POST /auth/signup
- POST /auth/login
- POST /auth/logout


# Profile
- GET /profile/view
- POST /profile/edit
- POST  /profile/change-password

# ConnectionRequest
- POST  /request/send/intrested/:id
- POST  /request/send/ignored/:id
make upper apis dynamic, POST /request/send/:status/:id

- POST  /request/review/accepted/:id
- POST  /request/review/rejected/:id

# User
- Get /user/connections
- Get /user/requests
- Get /user/feed

# 