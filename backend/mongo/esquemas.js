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
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  InterestedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  Image: [String],
  Address: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Status: {
    type: String,
    enum: ['Pending', 'Active', 'Canceled'] // As 3 opções válidas para o atributo "status"
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
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  Reviews: [{
    username: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    classification: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    }
  }],
  Status: {
    type: String,
    enum: ['Pending', 'Active'] // As 2 opções válidas para o atributo "status"
  },
  Image: [String],
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
  birthDate: {
    type: Date,
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