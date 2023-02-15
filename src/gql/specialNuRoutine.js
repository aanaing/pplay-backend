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

//Update Each Day
export const UPDATE_SPE_EACH_DAY = gql`
  mutation UpdateEachDay(
    $id: uuid!
    $day_1: String!
    $day_2: String!
    $day_3: String!
    $day_4: String!
    $day_5: String!
    $day_6: String!
    $day_7: String!
    $day_8: String!
    $day_9: String!
    $day_10: String!
    $day_11: String!
    $day_12: String!
    $day_13: String!
    $day_14: String!
    $day_15: String!
    $day_16: String!
    $day_17: String!
    $day_18: String!
    $day_19: String!
    $day_20: String!
    $day_21: String!
    $day_22: String!
    $day_23: String!
    $day_24: String!
    $day_25: String!
    $day_26: String!
    $day_27: String!
    $day_28: String!
    $day_29: String!
    $day_30: String!
    $user_name: uuid!
  ) {
    update_special_nutrition_routine_by_pk(
      pk_columns: { id: $id }
      _set: {
        day_1: $day_1
        day_10: $day_10
        day_11: $day_11
        day_12: $day_12
        day_13: $day_13
        day_14: $day_14
        day_15: $day_15
        day_16: $day_16
        day_17: $day_17
        day_18: $day_18
        day_19: $day_19
        day_2: $day_2
        day_20: $day_20
        day_22: $day_22
        day_21: $day_21
        day_23: $day_23
        day_24: $day_24
        day_25: $day_25
        day_26: $day_26
        day_27: $day_27
        day_28: $day_28
        day_29: $day_29
        day_3: $day_3
        day_30: $day_30
        day_4: $day_4
        day_5: $day_5
        day_6: $day_6
        day_7: $day_7
        day_8: $day_8
        day_9: $day_9
        fk_user_id: $user_name
      }
    ) {
      day_1
      day_10
      day_11
      day_12
      created_at
      day_13
      day_14
      day_15
      day_16
      day_17
      day_19
      day_18
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
      target
      thumbnail_image_url
      updated_at
      vegetarian
      fk_user_id
    }
  }
`;
