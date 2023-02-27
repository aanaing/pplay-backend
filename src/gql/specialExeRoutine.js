import { gql } from "@apollo/client";

//get customized exeRoutine
export const GET_ALL_SPECIAL_EXE_ROUTINE = gql`
  query GetAllSpeRoutine($limit: Int!, $offset: Int!, $search: String!) {
    special_exercise_routine(
      limit: $limit
      offset: $offset
      where: { special_exe_routine_name: { _ilike: $search } }
    ) {
      created_at
      day_1
      day_2
      day_3
      day_4
      day_5
      day_6
      day_7
      fk_users_id
      id
      special_exe_routine_name
      updated_at
      thumbnail_image_url
      routine_category
      description
      user {
        id
        username
      }
    }
    special_exercise_routine_aggregate(
      where: { special_exe_routine_name: { _ilike: $search } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

//Delete customized exeroutine
export const DELETE_SPECIAL_EXE_ROUTINE = gql`
  mutation MyMutation($id: uuid!) {
    delete_special_exercise_routine_by_pk(id: $id) {
      id
    }
  }
`;

//Create customized exeroutine

export const CREATE_SPECIAL_EXE_ROUTINE = gql`
  mutation MyMutation(
    $special_exe_routine_name: String!
    $day_1: uuid!
    $day_2: uuid!
    $day_3: uuid!
    $day_4: uuid!
    $day_5: uuid!
    $day_6: uuid!
    $day_7: uuid!
    $user_name: uuid!
    $thumbnail_image_url: String!
    $routine_category: String!
    $description: String!
  ) {
    insert_special_exercise_routine_one(
      object: {
        day_1: $day_1
        day_2: $day_2
        day_3: $day_3
        day_4: $day_4
        day_5: $day_5
        day_6: $day_6
        day_7: $day_7
        fk_users_id: $user_name
        special_exe_routine_name: $special_exe_routine_name
        thumbnail_image_url: $thumbnail_image_url
        routine_category: $routine_category
        description: $description
      }
    ) {
      created_at
      day_1
      day_2
      day_3
      day_4
      day_5
      day_6
      day_7
      fk_users_id
      id
      special_exe_routine_name
      updated_at
      thumbnail_image_url
      routine_category
      description
      user {
        id
        username
      }
    }
  }
`;

//Update Special exercise routine
export const UPDATE_SPECIAL_EXE_ROUTINE = gql`
  mutation MyMutation(
    $id: uuid!
    $special_exe_routine_name: String!
    $day_1: uuid!
    $day_2: uuid!
    $day_3: uuid!
    $day_4: uuid!
    $day_5: uuid!
    $day_6: uuid!
    $day_7: uuid!
    $user_name: uuid!
    $thumbnail_image_url: String!
    $routine_category: String!
    $description: String!
  ) {
    update_special_exercise_routine_by_pk(
      pk_columns: { id: $id }
      _set: {
        day_1: $day_1
        day_2: $day_2
        day_3: $day_3
        day_4: $day_4
        day_5: $day_5
        day_6: $day_6
        day_7: $day_7
        fk_users_id: $user_name
        special_exe_routine_name: $special_exe_routine_name
        thumbnail_image_url: $thumbnail_image_url
        routine_category: $routine_category
        description: $description
      }
    ) {
      created_at
      day_1
      day_2
      day_3
      day_4
      day_5
      day_6
      day_7
      fk_users_id
      id
      special_exe_routine_name
      updated_at
      thumbnail_image_url
      routine_category
      description
      user {
        id
        username
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

// for sub_type dropdown list
export const SUB_TYPE_NAME = gql`
  query MyQuery {
    video_sub_type {
      id
      sub_type_name
    }
  }
`;
