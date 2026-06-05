# FirstBuy Demo Project - Technical Documentation

## 1. Introduction
FirstBuy is a comprehensive property marketplace and rewards platform. It connects home buyers, builders, owners, and agents. The platform incentivizes users by allowing them to earn credits through everyday receipt uploads, which can later be redeemed as discounts on property purchases.

## 2. Architecture & Tech Stack
- **Frontend**: React.js with Vite, React Router for navigation, and standard CSS for styling.
- **Backend**: Django (Python) REST API.
- **Database**: SQLite (default for development), structured with Django ORM.

## 3. Database Models (Backend)

The backend is modularized into several Django apps, each handling a specific domain of the platform.

### 3.1 Accounts (`accounts` app)
- **`CustomUser`**: Extends Django's `AbstractUser`. Uses email for authentication instead of a username.
  - **Fields**: `email`, `full_name`, `phone`, `role` (user, builder, owner, agent), `avatar`, `tier` (bronze, silver, gold, platinum), `total_credits`.
  - **Purpose**: Central user model managing authentication, role-based access, loyalty tiers, and credit balances.

### 3.2 Properties (`properties` app)
- **`Property`**:
  - **Fields**: `builder` (ForeignKey to User), `title`, `description`, `price_in_inr`, `location`, `trust_score`, `max_credit_discount_allowed`, `status` (available, booked), `buyer`, `created_at`, `updated_at`.
  - **Purpose**: Represents a real estate listing.
- **`PropertyImage`**:
  - **Fields**: `property`, `image`, `is_primary`, `created_at`.
  - **Purpose**: Stores multiple images for a property listing.
- **`SavedProperty`**:
  - **Fields**: `user`, `property`, `saved_at`.
  - **Purpose**: Acts as a wishlist or bookmark feature for users.

### 3.3 Receipts (`receipts` app)
- **`Receipt`**:
  - **Fields**: `user`, `store_name`, `amount_spent`, `receipt_image`, `status` (pending, approved, rejected), `uploaded_at`, `reviewed_at`, `admin_notes`.
  - **Purpose**: Allows users to upload their shopping receipts to earn platform credits. Admins review and approve/reject these.

### 3.4 Credits & Rewards (`credits` app)
- **`CreditTransaction`**:
  - **Fields**: `user`, `amount`, `transaction_type` (earn_receipt, spend_property, bonus), `description`, `created_at`.
  - **Purpose**: Ledger for tracking all credits earned and spent by a user.
- **`RedemptionRequest`**:
  - **Fields**: `user`, `property`, `credits_spent`, `status` (pending, approved, rejected), `requested_at`, `admin_notes`.
  - **Purpose**: Handles user requests to apply their earned credits towards a property purchase.

### 3.5 Reviews (`reviews` app)
- **`Review`**:
  - **Fields**: `user`, `property`, `rating` (1-5), `comment`, `created_at`.
  - **Purpose**: Allows users to leave feedback and ratings on properties.

### 3.6 Communications (`notifications` & `contact` apps)
- **`Notification`** (inferred): Stores user notifications for status updates (e.g., receipt approved).
- **`ContactMessage`**: Stores inquiries submitted via the "Contact Us" page.

---

## 4. Frontend Pages & Routing
The React application (`App.jsx`) is structured with several dedicated pages for distinct user journeys.

- **`/` (Home)**: The landing page. Highlights key properties, platform benefits, and the core value proposition (Earn Credits -> Buy Home).
- **`/properties` (PropertiesPage)**: The main listing page where users can browse, filter, and search for available real estate.
- **`/how-it-works` (HowItWorksPage)**: Explains the platform's unique model—how uploading everyday receipts translates to property discounts.
- **`/rewards` (RewardsPage)**: Details the tier system (Bronze, Silver, Gold, Platinum) and the benefits of accumulating credits.
- **`/reviews` (ReviewsPage)**: A public-facing page showcasing testimonials and property reviews.
- **`/contact` (ContactPage)**: A form for users to get in touch with platform administrators or support.
- **`/signin` & `/signup`**: Authentication flows for users to create accounts and log in securely.
- **`/dashboard` (Dashboard - Protected Route)**: The logged-in user's portal. Here, users can:
  - View their current credit balance and tier.
  - Upload new receipts for approval.
  - Track the status of previously uploaded receipts.
  - View their saved properties and redemption requests.

---

## 5. Future Scope & Enhancements

As the project scales from a demo to a production-ready application, the following enhancements are recommended:

1. **Payment Gateway Integration**: 
   - Integrate Stripe, Razorpay, or PayPal to handle actual property booking amounts and deposits.
2. **Advanced Receipt Processing (OCR)**:
   - Implement Optical Character Recognition (e.g., AWS Textract or Google Cloud Vision) to automatically extract `store_name` and `amount_spent` from uploaded receipt images, reducing manual admin work.
3. **Real-time Notifications**:
   - Use WebSockets (Django Channels) to push real-time updates to the React frontend when a receipt is approved or a property status changes.
4. **Geolocation and Maps**:
   - Integrate Google Maps API or Mapbox on the `PropertiesPage` for map-based property discovery.
5. **Admin Dashboard**:
   - Build a custom React admin dashboard (or enhance the Django admin) with analytics, user growth metrics, and an efficient receipt approval queue.
6. **Mobile Application**:
   - Port the React web application to React Native to provide a seamless mobile experience, which is crucial for easy receipt scanning via smartphone cameras.
7. **Database Migration**:
   - Migrate from SQLite to PostgreSQL for robust, concurrent data handling in production.
8. **Role-Specific Dashboards**:
   - Create distinct dashboard experiences for Builders/Owners to manage their property listings, track leads, and view analytics on their properties.
