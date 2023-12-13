# Image Labeller v1.0.0

## Objective
This application aims to provide an UI for data cleaning/labelling purposes. It also provides a secondary function for creating your image dataset

## Features
### 1. Image Downloading (Completed)
This feature allows user to create of his/her own image datasets. In this feature, we will use Google's Custom Search API to source for images. Unfortunately, we are restricted to 200 images per query due to API limitations.
### 2. Image deletion (Completed)
This features allows user to delete images from a folder. This is useful in cases where you have a labelled folder (e.g. 'cat'), and you want to remove all the non-cat pictures inside
### 3. Image Relocation (Completed)
This feature will allow user to move images to a certain directory. This is useful when you have multiple labels in a directory. For instance, if you have a directory with pictures of cats and dogs, and you want to separate them into a 'cat' folder and a 'dog' folder, you can do so with this feature.
### 4. Image Labelling (In Progress)
This feature will allow users to label their image with bounding boxes or freeform segmentation masks. The details can be stored in COCO format.


## Frameworks
Electron-React Application
