import { gql } from "@apollo/client";

export const DELETE_IMAGE = gql`
  mutation MyMutation($image_name: String!) {
    deleteImage(imageName: $image_name) {
      error
      message
    }
  }
`;

export const GET_IMAGE_UPLOAD_URL = gql`
  mutation MyMutation($contentType:String!) {
    getImageUploadUrl(contentType:$contentType) {
      error
      imageName
      contentType
      imageUploadUrl
      message
    }
  }
`;
