import { gql } from "@apollo/client";

// get specialNuRoutine data
export const GET_ALL_SPE_NUROUTINES = gql`
  query getAllNuRoutine($limit: Int!, $offset: Int!, $search: String!) {
    special_nutrition_routine(
      limit: $limit
      offset: $offset
      where: { nutrition_routine_name: { _ilike: $search } }
    ) {
      routine_category
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
      user {
        id
        username
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
      routine_category
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
      user {
        id
        username
      }
      day_31
      day_32
      day_33
      day_34
      day_35
      day_36
      day_37
      day_38
      day_39
      day_40
      day_41
      day_42
      day_43
      day_44
      day_45
      day_46
      day_47
      day_48
      day_49
      day_50
      day_51
      day_52
      day_53
      day_54
      day_55
      day_56
      day_57
      day_58
      day_59
      day_60
      day_61
      day_62
      day_63
      day_64
      day_65
      day_66
      day_67
      day_68
      day_69
      day_70
      day_71
      day_72
      day_73
      day_74
      day_75
      day_76
      day_77
      day_78
      day_79
      day_70
      day_80
      day_81
      day_82
      day_83
      day_84
      day_85
      day_86
      day_87
      day_88
      day_89
      day_90
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
    $routine_category: String!
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
        routine_category: $routine_category
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
      routine_category
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
    $routine_category: String!
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
        routine_category: $routine_category
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
      routine_category
      thumbnail_image_url
      updated_at
      fk_user_id
      vegetarian
      user_subscription_level {
        created_at
        id
        subscription_type
        updated_at
      }
      user {
        id
        username
      }
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
    $day_31: String!
    $day_32: String!
    $day_33: String!
    $day_34: String!
    $day_35: String!
    $day_36: String!
    $day_37: String!
    $day_38: String!
    $day_39: String!
    $day_40: String!
    $day_41: String!
    $day_42: String!
    $day_43: String!
    $day_44: String!
    $day_45: String!
    $day_46: String!
    $day_47: String!
    $day_48: String!
    $day_49: String!
    $day_50: String!
    $day_51: String!
    $day_52: String!
    $day_53: String!
    $day_54: String!
    $day_55: String!
    $day_56: String!
    $day_57: String!
    $day_58: String!
    $day_59: String!
    $day_60: String!
    $day_61: String!
    $day_62: String!
    $day_63: String!
    $day_64: String!
    $day_65: String!
    $day_66: String!
    $day_67: String!
    $day_68: String!
    $day_69: String!
    $day_70: String!
    $day_71: String!
    $day_72: String!
    $day_73: String!
    $day_74: String!
    $day_75: String!
    $day_76: String!
    $day_77: String!
    $day_78: String!
    $day_79: String!
    $day_80: String!
    $day_81: String!
    $day_82: String!
    $day_83: String!
    $day_84: String!
    $day_85: String!
    $day_86: String!
    $day_87: String!
    $day_88: String!
    $day_89: String!
    $day_90: String!
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
        day_31: $day_31
        day_32: $day_32
        day_33: $day_33
        day_34: $day_34
        day_35: $day_35
        day_36: $day_36
        day_37: $day_37
        day_38: $day_38
        day_39: $day_39
        day_40: $day_40
        day_41: $day_41
        day_42: $day_42
        day_43: $day_43
        day_44: $day_44
        day_45: $day_45
        day_46: $day_46
        day_47: $day_47
        day_48: $day_48
        day_49: $day_49
        day_50: $day_50
        day_51: $day_51
        day_52: $day_52
        day_53: $day_53
        day_54: $day_54
        day_55: $day_55
        day_56: $day_56
        day_57: $day_57
        day_58: $day_58
        day_59: $day_59
        day_60: $day_60
        day_61: $day_61
        day_62: $day_62
        day_63: $day_63
        day_64: $day_64
        day_65: $day_65
        day_66: $day_66
        day_67: $day_67
        day_68: $day_68
        day_69: $day_69
        day_70: $day_70
        day_71: $day_71
        day_72: $day_72
        day_73: $day_73
        day_74: $day_74
        day_75: $day_75
        day_76: $day_76
        day_77: $day_77
        day_78: $day_78
        day_79: $day_79
        day_80: $day_80
        day_81: $day_81
        day_82: $day_82
        day_83: $day_83
        day_84: $day_84
        day_85: $day_85
        day_86: $day_86
        day_87: $day_87
        day_88: $day_88
        day_89: $day_89
        day_90: $day_90
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
      routine_category
      thumbnail_image_url
      updated_at
      vegetarian
      fk_user_id
      day_31
      day_32
      day_33
      day_34
      day_35
      day_36
      day_37
      day_38
      day_39
      day_40
      day_41
      day_42
      day_43
      day_44
      day_45
      day_46
      day_47
      day_48
      day_49
      day_50
      day_51
      day_52
      day_53
      day_54
      day_55
      day_56
      day_57
      day_58
      day_59
      day_60
      day_61
      day_62
      day_63
      day_64
      day_65
      day_66
      day_67
      day_68
      day_69
      day_70
      day_71
      day_72
      day_73
      day_74
      day_75
      day_76
      day_77
      day_78
      day_79
      day_70
      day_80
      day_81
      day_82
      day_83
      day_84
      day_85
      day_86
      day_87
      day_88
      day_89
      day_90
    }
  }
`;
