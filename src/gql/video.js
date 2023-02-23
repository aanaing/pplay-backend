import { gql } from "@apollo/client";

//get all videos
export const ALL_VIDEOS = gql`
  query MyQuery($search: String!) {
    video_list(where: { video_package_name: { _ilike: $search } }) {
      created_at
      duration
      fk_video_sub_type_id
      fk_user_subscription_level_id
      id
      main_type
      promotion
      target_period
      thumbnail_image_url
      updated_at
      video_package_name
      video_url_a
      video_url_b
      description
      user_subscription_level {
        subscription_type
        id
      }
      video_sub_type {
        id
        sub_type_name
      }
    }
  }
`;

//for sub_type_name
export const SUB_TYPE_NAME = gql`
  query MyQuery {
    video_sub_type {
      id
      sub_type_name
    }
  }
`;

//Delete Video
export const DELETE_VIDEOS_PK = gql`
  mutation MyMutation($id: uuid!) {
    delete_video_list_by_pk(id: $id) {
      id
    }
  }
`;

// Create video
export const CREATE_VIDEOS = gql`
  mutation MyMutation(
    $video_package_name: String!
    $main_type: String!
    $target_period: String!
    $duration: String
    $video_url_a: String!
    $video_url_b: String!
    $thumbnail_image_url: String!
    $promotion: Boolean!
    $sub_name: uuid!
    $package_type: Int!
    $description: String!
  ) {
    insert_video_list_one(
      object: {
        duration: $duration
        fk_video_sub_type_id: $sub_name
        fk_user_subscription_level_id: $package_type
        main_type: $main_type
        promotion: $promotion
        target_period: $target_period
        video_package_name: $video_package_name
        video_url_a: $video_url_a
        video_url_b: $video_url_b
        thumbnail_image_url: $thumbnail_image_url
        description: $description
      }
    ) {
      created_at
      duration
      fk_video_sub_type_id
      fk_user_subscription_level_id
      id
      main_type
      promotion
      target_period
      thumbnail_image_url
      updated_at
      video_package_name
      video_url_a
      video_url_b
      description
    }
  }
`;

//create video for zumba
export const CREATE_VIDEOS_ZUMBA = gql`
  mutation MyMutation(
    $video_package_name: String!
    $main_type: String!
    $target_period: String!
    $duration: String
    $video_url_a: String!
    $video_url_b: String!
    $thumbnail_image_url: String!
    $promotion: Boolean!
    $package_type: Int!
    $description: String!
  ) {
    insert_video_list_one(
      object: {
        duration: $duration
        fk_user_subscription_level_id: $package_type
        main_type: $main_type
        promotion: $promotion
        target_period: $target_period
        video_package_name: $video_package_name
        video_url_a: $video_url_a
        video_url_b: $video_url_b
        thumbnail_image_url: $thumbnail_image_url
        description: $description
      }
    ) {
      created_at
      duration
      fk_video_sub_type_id
      fk_user_subscription_level_id
      id
      main_type
      promotion
      target_period
      thumbnail_image_url
      updated_at
      video_package_name
      video_url_a
      video_url_b
      description
    }
  }
`;

//Update video
export const UPDATE_VIDEOS = gql`
  mutation MyMutation(
    $id: uuid!
    $video_package_name: String!
    $main_type: String!
    $target_period: String!
    $duration: String!
    $video_url_a: String!
    $video_url_b: String!
    $thumbnail_image_url: String!
    $promotion: Boolean!
    $sub_name: uuid
    $package_type: Int!
    $description: String!
  ) {
    update_video_list_by_pk(
      pk_columns: { id: $id }
      _set: {
        duration: $duration
        fk_video_sub_type_id: $sub_name
        fk_user_subscription_level_id: $package_type
        main_type: $main_type
        promotion: $promotion
        thumbnail_image_url: $thumbnail_image_url
        target_period: $target_period
        video_package_name: $video_package_name
        video_url_a: $video_url_a
        video_url_b: $video_url_b
        description: $description
      }
    ) {
      created_at
      duration
      fk_video_sub_type_id
      fk_user_subscription_level_id
      id
      main_type
      promotion
      target_period
      thumbnail_image_url
      updated_at
      video_package_name
      video_url_a
      video_url_b
      description
      user_subscription_level {
        id
        subscription_type
      }
      video_sub_type {
        id
        sub_type_name
      }
    }
  }
`;

//update video for zumba
export const UPDATE_VIDEOS_ZUMBA = gql`
  mutation MyMutation(
    $id: uuid!
    $video_package_name: String!
    $main_type: String!
    $target_period: String!
    $duration: String!
    $video_url_a: String!
    $video_url_b: String!
    $thumbnail_image_url: String!
    $promotion: Boolean!
    $package_type: Int!
    $description: String!
  ) {
    update_video_list_by_pk(
      pk_columns: { id: $id }
      _set: {
        duration: $duration
        fk_user_subscription_level_id: $package_type
        main_type: $main_type
        promotion: $promotion
        thumbnail_image_url: $thumbnail_image_url
        target_period: $target_period
        video_package_name: $video_package_name
        video_url_a: $video_url_a
        video_url_b: $video_url_b
        description: $description
      }
    ) {
      created_at
      duration
      fk_user_subscription_level_id
      id
      main_type
      promotion
      target_period
      thumbnail_image_url
      updated_at
      video_package_name
      video_url_a
      video_url_b
      description
      user_subscription_level {
        id
        subscription_type
      }
    }
  }
`;

// image upload
export const GET_IMAGE_UPLOAD_URL = gql`
  mutation GET_IMAGE_UPLOAD_URL {
    getImageUploadUrl {
      error
      imageName
      imageUploadUrl
      message
    }
  }
`;

// video filter MAIN and SUB type
export const VIDEO_CATEGORY = gql`
  query VIDEO_LIST($main_type: String, $sub_type: uuid) {
    video_list(
      where: {
        _and: {
          main_type: { _eq: $main_type }
          _and: { fk_video_sub_type_id: { _eq: $sub_type } }
        }
      }
    ) {
      video_url_b
      video_url_a
      video_package_name
      video_sub_type {
        sub_type_name
      }
      thumbnail_image_url
      target_period
      promotion
      fk_user_subscription_level_id
      main_type
      id
      duration
      created_at
    }
  }
`;

// video filter MAIN type
export const ALL_VIDEO_CATEGORY = gql`
  query VIDEO_LIST($main: String) {
    video_list(where: { _and: { main_type: { _eq: $main } } }) {
      created_at
      duration
      fk_video_sub_type_id
      id
      main_type
      fk_user_subscription_level_id
      promotion
      target_period
      thumbnail_image_url
      video_sub_type {
        sub_type_name
        id
      }
      video_package_name
      video_url_a
      video_url_b
    }
  }
`;

export const SUB_TYPE = gql`
  query VIDEO_SUB_TYPE($sub_type: String) {
    video_sub_type(where: { _and: { sub_type_name: { _eq: $sub_type } } }) {
      id
    }
  }
`;
