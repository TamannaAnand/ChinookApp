import Joi from 'joi'

//Declaring fields

//Artists
const artistFields = {
    Name: Joi.string().max(20).min(1)
}

const artistPostSchema = Joi.object({
    Name: Joi.string().max(20).required()
})

 
const artistPatchSchema = Joi.object({
    ...artistFields
})

//Albums

const albumFields = {
    Title: Joi.string(),
    ArtistId: Joi.number().integer(),
    ReleaseYear: Joi.number().integer(),
}

const albumPostSchema = Joi.object({
    Title: Joi.string().required(),
    ArtistId: Joi.number().integer().required(),
    ...albumFields
})

//Patch schema not letting fields be empty 
const albumPatchSchema = Joi.object({
    ...albumFields
})

//Tracks

const trackFields = {
    Name: Joi.string().max(50),
    AlbumId: Joi.number(),
    MediaTypeId: Joi.number().integer().valid(1,2,3,4,5,6),
    GenreId: Joi.number().max(25),
    Composer: Joi.string().max(30),
    Milliseconds: Joi.number()
}

const trackPostSchema = Joi.object({
    Name: Joi.string().max(50).required(),
    AlbumId: Joi.number().required(),
    MediaTypeId: Joi.number().integer().valid(1,2,3,4,5).required(),
    Milliseconds: Joi.number().required(),
    ...trackFields
})

const trackPatchSchema = Joi.object({
    ...trackFields
})



//Schema Development


//Export Schema Requirements
export const validatePostArtist = payload => {
    return artistPostSchema.validate(payload)
}

export const validatePatchArtist = payload => {
    return artistPatchSchema.validate(payload)
}

export const validatePostAlbum = payload => {
    return albumPostSchema.validate(payload)
}

export const validatePatchAlbum = payload => {
    return albumPatchSchema.validate(payload)
}

export const validatePostTrack = payload => {
    return trackPostSchema.validate(payload)
}

export const validatePatchTrack = payload => {
    return trackPatchSchema.validate(payload)
}



