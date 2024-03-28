//esquemas.js
import mongoose from 'mongoose';

// Esquema do Evento
const eventSchema = new mongoose.Schema({
  IdEvent: {
    type: Number,
    required: true
  },
  Type: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  BegDate: {
    type: Date,
    required: true
  },
  EndDate: {
    type: Date,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  AgeRecomendation: {
    type: Number,
    required: true
  },
  Creator: {
    type: String,
    required: true
  },
  InterestedUsers: {
    type: [String],
    default: []
  },
  Status: {
    type: String,
    required: true
  },
  Image: String,
  Address: {
    type: String,
    required: true
  }
});

// Esquema do Local
const locationSchema = new mongoose.Schema({
  IdLocal: {
    type: Number,
    required: true
  },
  Type: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  AgeRecomendation: Number,
  Creator: {
    type: String,
    required: true
  },
  Reviews: {
    type: [Number],
    default: []
  },
  Status: {
    type: String,
    required: true
  },
  Image: String,
  Address: String
});

// Esquema do Usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passHash: {
    type: String,
    required: true
  },
  passSalt: {
    type: String,
    required: true
  },
  AdminPermission: {
    type: Boolean,
    default: false
  },
  EventCreator: {
    type: [Number],
    default: []
  },
  EventHasInterest: {
    type: [Number],
    default: []
  },
  LocalCreator: {
    type: [Number],
    default: []
  },
  LocalReviews: {
    type: [Number],
    default: []
  },
  LocalFavorites: {
    type: [Number],
    default: []
  }
});

// Modelo do Evento com especificação de coleção
export const Events = mongoose.model("Events", eventSchema,"Events");
// Modelo do Local com especificação de coleção
export const Locations = mongoose.model("Locations", locationSchema, "Locations");
// Modelo do Usuário com especificação de coleção
export const Users = mongoose.model("Users",userSchema,"Users");
