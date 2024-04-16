# `Water B&B`
Check out a live version of Water B&B here:
[Water B&B Live][render]

[render]:https://water-bandb.onrender.com

Water B&B is a website for renting privately owned living spaces for those of us who would prefer someones house over a hotel.

## Features & Implementation
### Single-Page App
*React router and components*

Water B&B is a single page app. All “pages” are rendered at a root url “/” by a
collection of shuffling react components. The React router handles the logic
associated with component navigation and updates an addendum to the root route.

*Frontend and Backend Interaction*

Water B&B server interactions are capable of full crud operations. Locally I am using sequalize Models, Migrations, and Seeders to populate the sequel database. The livesite is using Postgres and is hosted through Render. All components are using React hooks, Redux, and CSRF fetch in order to populate the frontend with seed data on load and to give authorization to logged in Users. A demo user link is available for ease of use and has a userId of 1.
![Login/Signup for auth](https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/login.png?alt=media&token=d78e52f7-e2df-46b4-9e1d-a327d201898e)

*CRUD*

Spots, reviews, and bookings are the components utilizing our crud operations.
React components exist for each corresponding action in the app.

*Reviews*

With the proper authorization, Users can post reviews and delete reviews. If a user owns a spot they can't post a review. A user can only delete reviews they themselves posted. If you are not logged in then You can't post or delete reviews.
![Delete Review](https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/deleteReview.png?alt=media&token=550125f0-68ef-4ea9-9fd4-3afa3d1a4259)

![Post Review](https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/postreview.png?alt=media&token=2b69dc71-00eb-4155-994c-b5a709b27cb2)


*Spots*

Logged in users can Create new spots and update spots they own. The update component houses a Delete modal as well as a link that will direct the user to a form that is prepopulated with the current spots information.
