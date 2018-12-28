const { GraphQLServer } = require("graphql-yoga");
const env = require("dotenv").config();
const _ = require("lodash");
const firebase = require("firebase");
const express = require("express");
const uuid = require("uuid");
const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
};

firebase.initializeApp(config);
const database = firebase.database();
const coursesRef = firebase.database().ref("courses");
const gebruikersRef = database.ref("gebruikers");

function writeUserData({ userId, name, email, imageUrl }) {
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      username: name,
      email: email,
      profile_picture: imageUrl
    });
}

function mapper(objects) {
  return;
}
async function getCourses() {
  const coursesSnap = await coursesRef.once("value");
  const courses = await coursesSnap.val();
  if (courses === null) return [];
  return mapper(courses);
}

async function getAllItems(reference) {
  const snap = await reference.once("value");
  const arrayOfObjects = await snap.val();
  if (arrayOfObjects === null) return [];
  return Object.keys(arrayOfObjects).map(o => Object.assign({ id: o }, arrayOfObjects[o]));
}
const typeDefs = `
  type Query {
    hello(name: String): String!
    courses: [Course]
    gebruikers: [Gebruiker]
  }

  type Gebruiker {
     id:ID!
      name: String!
      email: String!
  }
  input GebruikerInput {
    name: String!
    email: String!
  }
  type Course {
      id: ID!
      title: String
      
  }
  type Mutation {
      createCourse(title: String) : Course
      createGebruiker(input: GebruikerInput): Gebruiker
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    courses: (parent, args, ctx, info) => getCourses(),
    gebruikers: async (parent, args, ctx, info) => getAllItems(gebruikersRef)
  },
  Mutation: {
    createCourse: async (parent, { title }, ctx, info) => {
      const { key: id } = await coursesRef.push({ title });
      return { id, title };
    },
    createGebruiker: async (parent, { input }, ctx, info) => {
      const { key: id } = await gebruikersRef.push(input);
      return { id, ...input };
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
