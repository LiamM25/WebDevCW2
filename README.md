# Web Application Development 2 CW2

The Scottish Pantry Network (TSPN) Web Application was developed as part of GCU coursework for Web Application Development 2. The application is designed to aid in the sharing of surplus food among individuals and local food pantries, with the aim of addressing food insecurity in the community.

The website uses a runtime database populated with testing data for demonstration purposes.




## Testing Credentials
There are four levels of privilege.

### Visitor
No credentials.


### User
Email: johndoe8@email.com

Password: userPassword


### Pantry
Email: pantry@email.com

Password: pantryPassword

### Admin
Email: admin@email.com

Password: adminPassword


## Features
Features are listed by level of privilege.

### Visitor 
•	Register Account
### User
•	Login

•	Logout

•	Donate
### Pantry
•	Login

•	Logout

•	Manage Inventory
### Admin
•	Login

•	Logout

•	Create privileged accounts.

•	Manage Inventory

•	Manage user database.

## Manual

### User
User Donation

•	Users can donate by logging in and going to the donate page.

•	Users fill in the fields which reflect the donation they are making.

•	If a user selects to donate fruit and veg, a harvest date option will appear.

•	The user will select the pantry location before donating.

•	The donation will then be reflected on the inventory management pages.


### Pantry
Inventory Management

•	The Inventory Management page is used to manage the inventory within the current pantry and provides visibility into available items in other pantries. This feature allows pantries to share surplus items or needed supplies.

•	Users can edit any field of an item using the "Update Info" section for that item.

•	The "Confirmed" field indicates whether a donation has been received by the pantry. Pantry users can update this field to "Yes" once they have received a donation, indicating its presence in their pantry.

•	The "Expired Items" table displays a list of items that have passed their expiration dates. This feature assists pantry workers in identifying and removing expired items from shelves before deleting them from the inventory database.

### Admin
Account Creation

•	Admin users can create new privileged accounts by navigation to the account creation page.
They will fill out the fields of the new user.

•	If a new pantry account is being created, a new field to select the pantry name will be presented.

•	The new account will be available in the admin user database.

 Inventory Management

•	Inventory can be viewed and filtered by an admin in the inventory page.

•	This page reflects the entire inventory within the network and shows where each item is located.

•	Items can be removed by admin with the corresponding delete button and the end of the item details.

User Database

•	Admin can view and manage the networks user database in the user database page.

•	This page gives the users full name, email address and role within the system.

•	The admin can also delete users.
