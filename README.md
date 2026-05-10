# G V Hallikeri PU college - Technical Overview

This project is built with Next.js and Firebase.

## Database Management System (DBMS)
The application uses **Google Firebase Firestore**, a NoSQL cloud database.

## Data Structure (Schema)

### Collections (Equivalent to Tables)

#### 1. `pages`
Stores the structure of the website's pages.
- `title`: The display name of the page.
- `slug`: The unique URL identifier.
- `visible`: Whether the page is public.
- `order_position`: Order in the navigation menu.

#### 2. `blocks`
Modular content units assigned to pages.
- `page_id`: ID of the associated page.
- `type`: Type of block (`hero`, `text`, `image`, `announcements`).
- `order_position`: Sort order within the page.
- `data`: A flexible object containing content specific to the block type.

#### 3. `team`
Faculty and staff profiles.
- `name`, `title`, `email`, `department`, `expertise`, `imageUrl`.

#### 4. `activities`
NCC, NSS, and other college activity details.
- `name`, `slug`, `shortdescription`, `longdescription`, `focusareas`, `courses`.

#### 5. `departments`
Academic department details.
- `name`, `slug`, `shortdescription`, `longdescription`, `researchareas`, `courses`.

#### 6. `events`
Campus events and calendar items.
- `title`, `date`, `location`, `type`, `description`.

#### 7. `gallery`
Media for the gallery page.
- `src`, `alt`, `order_position`.

## Authentication
Admin access is managed via **Firebase Authentication** using an administrative password.
