# Petsgram

**Petsgram** is a mobile-first pets photo-sharing application built with **React Native** (frontend) and **Django** (backend). The app allows users to create posts by sharing their pets' photos, fostering a community of pet lovers. This project is a personal hobby project built for my portfolio.

## Features:
* AI-powered image validation (MobileNet): Ensures that only pet photos can be uploaded. Posts will only be created if the image is confirmed to be a pet.
* User registration and authentication.
* Image storage and retrieval.

## AI Integration - MobileNet:
The MobileNet model is used to validate whether an uploaded image is of a pet. Here’s how it works:
* When a user uploads a photo, it is temporarily saved, and the image is processed using MobileNet, a pre-trained convolutional neural network.
* The model makes predictions based on the image and provides a list of the top likely categories.
* The app checks the predictions for pet-related categories like "dog," "cat," "puppy," "kitten," or "animal."
* If the image matches any of these categories, the post is created. Otherwise, the upload is rejected with an error message.
The validation ensures only genuine pet photos are uploaded, improving the overall user experience.

## Tech Stack:
* __Frontend__: React Native
* __Backend__: Django (REST API)
* __AI Integration__: Image validation during post creation.

## To-Do:
* Improve AI validation accuracy by fine-tuning the MobileNet model.
* Add more features like post categories and advanced filtering.

## Project Purpose:
This project was built as a personal hobby project to demonstrate my skills in building full-stack applications using React Native, Django, and AI integration with MobileNet. It showcases my ability to handle both frontend and backend development, and includes a practical implementation of machine learning in image validation.

## Live Demo
Here is a demo of the Petsgram app in action:
[Watch the demo on YouTube](https://youtu.be/AijC5ycJ1Pg)


