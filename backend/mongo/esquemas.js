//esquemas.js
import mongoose from 'mongoose';

const { Schema } = mongoose; // Importar Schema de mongoose

// Esquema do Coleção Events
const eventSchema = new mongoose.Schema({
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
  Image: String,
  Address: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  }
});


// Esquema da Coleção Locations
const locationSchema = new mongoose.Schema({
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
  Reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Users' // Referência ao modelo de utilizador
  }],
  Status: {
    type: String,
    required: true
  },
  Image: String,
  Address: String
});

// Esquema do Coleção Users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  HashedPassword: {
    type: String,
    required: true
  },
  AdminPermission: {
    type: Boolean,
    default: false
  },
  EventCreator: [{
    type: Schema.Types.ObjectId,
    ref: 'Events' // Referência ao modelo de evento, remova se não for necessário
  }],
  EventHasInterest: [{
    type: Schema.Types.ObjectId,
    ref: 'Events' // Referência ao modelo de evento, remova se não for necessário
  }],
  LocalCreator: [{
    type: Schema.Types.ObjectId,
    ref: 'Locations' // Referência ao modelo de local, remova se não for necessário
  }],
  LocalReviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Locations' // Referência ao modelo de local, remova se não for necessário
  }],
  LocalFavorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Locations' // Referência ao modelo de local, remova se não for necessário
  }]
});


// Modelo do Evento com especificação de coleção
export const Events = mongoose.model("Events", eventSchema, "Events");
// Modelo do Local com especificação de coleção
export const Locations = mongoose.model("Locations", locationSchema, "Locations");
// Modelo do Usuário com especificação de coleção
export const Users = mongoose.model("Users", userSchema, "Users");