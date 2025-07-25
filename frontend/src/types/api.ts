export interface UserProfile {
    id: string; // Changed from 'id' to '_id' to match Mongoose's default primary key
    username: string;
    email: string;
    role: 'user' | 'admin';
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    dob?: string; // Stored as ISO string "YYYY-MM-DDTHH:mm:ss.sssZ"
    createdAt: string;
    updatedAt: string;
}

/**
 * Interface for the response data from the /api/auth/login endpoint.
 */
export interface LoginResponse {
    accessToken: string;
    id: string; // The Mongoose ID of the user
    username: string;
    email: string;
    role: string;
    // Backend might also return a 'message' on success, but it's not strictly required here
    message?: string; // Added for consistency if backend sends it
}

/**
 * Interface for the request body when logging in a user.
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Interface for the request body when registering a user.
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    // role?: 'user' | 'admin'; // If you allow role selection during registration
}

/**
 * Interface for the response data from the /api/auth/register endpoint.
 * Assuming it returns a message and potentially user data/token
 */
export interface RegisterResponse {
    msg: string; // Changed from 'msg' to 'message'
    _id?: string; // Mongoose ID if returned
    username?: string;
    email?: string;
    role?: string;
    token?: string; // If registration immediately returns a token
}

/**
 * Interface for the request body when updating a user's profile.
 * All fields are optional as they might not all be updated at once.
 * Null is included to allow clearing a field (e.g., setting an optional field to null).
 */
export interface UpdateProfileRequest {
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | null;
    dob?: string | null; // Keep as string for ISO date string or null
}

/**
 * Generic interface for API error responses from the backend.
 * This structure is based on how your backend sends error messages.
 */
export interface ApiErrorResponse {
    msg?: string; // Changed from 'msg' to 'message'
    error?: string; // Sometimes a single 'error' field is used
    details?: string; // For more technical details (e.g., from catch block)
    errors?: { [key: string]: string }; // For field-specific validation errors (e.g., { email: "Invalid format" })
}

// --- INTERFACES FOR INSTITUTION (from your previous code) ---

interface InstitutionLocation {
    place: string;
    city: string;
    state: string;
    country: string;
}

interface CourseAndFee {
    course: string;
    duration: string;
    fees: string;
    entranceExam: string[];
}

interface CourseSpecification {
    course: string;
    details: string;
}

interface PlacementDetail {
    highest: string;
    median: string;
    lowest: string;
}

interface Event {
    title: string;
    date: string; // ISO date string
    description?: string;
}

interface GalleryItem {
    imageUrl: string;
    caption?: string;
}

interface Facilities {
    infrastructure: "Available" | "Not Available";
    laboratories: "Available" | "Not Available";
    sportsFacilities: "Available" | "Not Available";
    hostel: "Available" | "Not Available";
    smartClassroom: "Available" | "Not Available";
}

interface Ranking {
    agency?: string;
    rank?: number;
    year?: number;
}

/**
 * Interface for the Institution object as returned by the backend.
 * This should mirror your backend's Institution Mongoose Schema.
 */
export interface InstitutionResponse {
    _id: string; // Mongoose ID
    name: string;
    owner: 'Government' | 'Private' | 'Public';
    type: 'college' | 'university';
    location: InstitutionLocation;
    establishedYear: number;
    category?: string;
    campusArea?: string;
    numDepartments?: number;
    affiliatedTo?: string;
    approvedBy?: string;
    famousCourse?: string;
    averageFee?: string;
    coursesAndFees: CourseAndFee[];
    courseSpecifications?: CourseSpecification[];
    placementDetails?: PlacementDetail;
    companiesVisited?: string[];
    announcements?: string[];
    additionalInfo?: string;
    events?: Event[];
    scholarship?: string;
    gallery?: GalleryItem[];
    facilities?: Facilities;
    rankings?: Ranking[];
    author: string; // User ID of the author
    createdAt: string; // Mongoose timestamps
    updatedAt: string; // Mongoose timestamps
}

// --- NEW INTERFACES FOR YOUR CUSTOM MODELS ---

/**
 * Interface for Centeraffilation model.
 * Mirrors backend/models/Centeraffilation.js
 */
export interface Centeraffilation {
    _id: string;
    name: string;
    address: string;
    centercode: string;
    qualification?: string;
    seatingcapacity: string; // Consider 'number' if it's a numeric count
    strength: string; // Consider 'number' if it's a numeric count
    noofsystem?: string; // Consider 'number' if it's a numeric count
    noofclassroom?: string; // Consider 'number' if it's a numeric count
    office?: 'yes' | 'no';
    receptiondesk?: 'yes' | 'no';
    toilet?: 'yes' | 'no';
    library?: 'no' | 'yes';
    website?: string;
    Contactno: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Interface for Certificate model.
 * Mirrors backend/models/Certificate.js
 */
export interface certificate {
    _id: string;
    name: string;
    fathername: string;
    mothername: string;
    course?: string;
    registrationno: string;
    Address: string;
    centername?: string;
    grade?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Interface for Course model.
 * Mirrors backend/models/Course.js
 */
export interface Course {
    _id: string;
    name: string;
    serialno: string;
    duration: string; // Consider 'number' if it's a numeric duration
    eligibility?: string;
    coursefee: string; // Consider 'number' if it's a numeric fee
    schilarship: string; // Typo: 'schilarship' -> 'scholarship'. Consider 'number' if numeric.
    details?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Interface for Student model.
 * Mirrors backend/models/Student.js
 */
export interface Student {
    _id: string;
    uid: string;
    fullName?: string;
    email: string;
    whatsapp?: string;
    dob: string; // Date object from backend is usually ISO string (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ")
    role?: 'user' | 'admin';
    Address: string;
    Course: string;
    Fname: string;
    Mname: string;
    religion?: 'Hinduism' | 'Islam' | 'Christianity' | 'Sikhism' | 'Buddhism' | 'Jainism' | 'Other' | 'Prefer not to say' | '';
    session: string;
    createdAt: string;
    updatedAt: string;
}
