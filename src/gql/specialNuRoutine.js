import { gql } from "@apollo/client";

// get specialNuRoutine data
export const GET_ALL_SPE_NUROUTINES = gql`
  query getAllNuRoutine($limit: Int!, $offset: Int!, $search: String!) {
    special_nutrition_routine(
      limit: $limit
      offset: $offset
      where: { nutrition_routine_name: { _ilike: $search } }
    ) {
      target
      created_at
      day_1
      day_10
      day_11
      day_12
      day_13
      day_14
      day_15
      day_16
      day_17
      day_18
      day_19
      day_2
      day_20
      day_21
      day_22
      day_23
      day_24
      day_25
      day_26
      day_27
      day_28
      day_29
      day_3
      day_30
      day_4
      day_5
      day_6
      day_7
      day_8
      day_9
      description
      duration_of_routine_in_days
      fk_user_subscription_level_id
      nutrition_routine_name
      id
      pdf_file_url
      thumbnail_image_url
      updated_at
      vegetarian
      fk_user_id
      user_subscription_level {
        created_at
        id
        subscription_type
        updated_at
      }
    }
    special_nutrition_routine_aggregate(
      where: { nutrition_routine_name: { _ilike: $search } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

//get Special nutrition rotine by pk
export const SPE_ROUTINE_BY_ID = gql`
  query MyQuery($id: uuid!) {
    special_nutrition_routine_by_pk(id: $id) {
      target
      created_at
      day_1
      day_10
      day_11
      day_12
      day_13
      day_14
      day_15
      day_16
      day_17
      day_18
      day_19
      day_2
      day_20
      day_21
      day_22
      day_23
      day_24
      day_25
      day_26
      day_27
      day_28
      day_29
      day_3
      day_30
      day_4
      day_5
      day_6
      day_7
      day_8
      day_9
      description
      duration_of_routine_in_days
      fk_user_subscription_level_id
      id
      nutrition_routine_name
      pdf_file_url
      thumbnail_image_url
      updated_at
      vegetarian
      fk_user_id
      user_subscription_level {
        created_at
        id
        subscription_type
        updated_at
      }
    }
  }
`;

//get users data
export const USER_ID = gql`
  query MyQuery {
    users {
      id
      username
    }
  }
`;

//delete Special nutrion routine
export const DELETE_SPE_NUROUTINE = gql`
  mutation DELETE_SPE_NUROUTINE($id: uuid!) {
    delete_special_nutrition_routine_by_pk(id: $id) {
      id
    }
  }
`;

//Create No days
export const CREATE_NODAYS = gql`
  mutation NoDays(
    $description: String!
    $nutrition_routine_name: String!
    $duration_of_routine_in_days: Int!
    $target: String!
    $pdf_file_url: String!
    $package_type: Int!
    $vegetarian: Boolean!
    $thumbnail_image_url: String!
    $user_name: uuid!
  ) {
    insert_special_nutrition_routine_one(
      object: {
        description: $description
        duration_of_routine_in_days: $duration_of_routine_in_days
        fk_user_subscription_level_id: $package_type
        nutrition_routine_name: $nutrition_routine_name
        pdf_file_url: $pdf_file_url
        target: $target
        thumbnail_image_url: $thumbnail_image_url
        vegetarian: $vegetarian
        fk_user_id: $user_name
      }
    ) {
      created_at
      day_1
      day_10
      day_11
      day_12
      day_13
      day_14
      day_16
      day_15
      day_17
      day_18
      day_19
      day_2
      day_20
      day_21
      day_23
      day_22
      day_24
      day_25
      day_26
      day_27
      day_28
      day_29
      day_3
      day_30
      day_4
      day_5
      day_6
      day_8
      day_7
      day_9
      description
      duration_of_routine_in_days
      fk_user_subscription_level_id
      id
      nutrition_routine_name
      pdf_file_url
      target
      thumbnail_image_url
      updated_at
      fk_user_id
    }
  }
`;

//Update No days
export const UPDATE_NODAYS = gql`
  mutation UpdateNoDays(
    $id: uuid!
    $description: String!
    $target: String!
    $pdf_file_url: String!
    $thumbnail_image_url: String!
    $vegetarian: Boolean!
    $package_type: Int!
    $duration_of_routine_in_days: Int!
    $nutrition_routine_name: String!
    $user_name: uuid!
  ) {
    update_special_nutrition_routine_by_pk(
      pk_columns: { id: $id }
      _set: {
        description: $description
        duration_of_routine_in_days: $duration_of_routine_in_days
        fk_user_subscription_level_id: $package_type
        nutrition_routine_name: $nutrition_routine_name
        pdf_file_url: $pdf_file_url
        target: $target
        thumbnail_image_url: $thumbnail_image_url
        vegetarian: $vegetarian
        fk_user_id: $user_name
      }
    ) {
      created_at
      day_1
      day_10
      day_11
      day_13
      day_12
      day_14
      day_15
      day_16
      day_17
      day_18
      day_19
      day_2
      day_21
      day_20
      day_22
      day_23
      day_24
      day_25
      day_26
      day_27
      day_28
      day_29
      day_3
      day_30
      day_4
      day_5
      day_6
      day_7
      day_8
      day_9
      description
      duration_of_routine_in_days
      fk_user_subscription_level_id
      id
      nutrition_routine_name
      pdf_file_url
      target
      thumbnail_image_url
      updated_at
      fk_user_id
      vegetarian
    }
  }
`;
