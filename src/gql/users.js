import { gql } from "@apollo/client";

export const USERS = gql`
  query Users($limit: Int!, $offset: Int!, $search: String) {
    users(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: {
        _or: [{ username: { _ilike: $search } }, { phone: { _ilike: $search } }]
      }
    ) {
      created_at
      disabled
      id
      address
      dob
      username
      phone
      gender
      updated_at
    }
    users_aggregate(
      where: {
        _or: [{ username: { _ilike: $search } }, { phone: { _ilike: $search } }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const USER = gql`
  query User_By_Pk($id: uuid!) {
    users_by_pk(id: $id) {
      created_at
      disabled
      id
      gender
      username
      phone
      basic_subscription_timeout
      medium_subscription_timeout
      premium_subscription_timeout
      special_subscription_timeout
      dob
      address
      updated_at
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Update_Users_By_Pk($id: uuid!, $disabled: Boolean!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { disabled: $disabled }) {
      created_at
      disabled
      id
      address
      gender
      dob
      username
      phone
      updated_at
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation UserScritpion(
    $durationInDays: Int!
    $subscription_type: String!
    $userId: uuid!
  ) {
    subscription(
      durationInDays: $durationInDays
      subscription_type: $subscription_type
      userId: $userId
    ) {
      error
      message
    }
  }
`;
