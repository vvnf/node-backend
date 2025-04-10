import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    



    // get user details from frontend
    const {fullName, email, username, password } = req.body
    console.log("email: ", email);
    // validation - not empty
    if (
        [fullName, email, username, password].some((each) => each?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for images, check for avatar
    //console.log(req.files); req.files is provided by multer
    const avatarLocalPath = req.files?.avatar[0]?.path; //uploded by multer middle on local and provided path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    // check if user created successfully && // remove password and refresh token field from response
    //calling DB and checking in DB if user_id is present and select the fields, 
    //by default it returns all fields but with -we are removing these two fields from the response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User created successfully",
        )
    )

});

export {registerUser};