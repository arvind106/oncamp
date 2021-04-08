module.exports = {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Oncamp Api',
      description: 'Oncamp app api',
      contact: {
        name: 'Arvind Singh',
        email: 'arvindssm106@gmail.com',
        url: 'https://thebinoteh.com/'
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    servers: [
        {
          url: 'http://localhost:5600/api/v1',
          description: 'Local server'
        },
        {
          url: 'http://142.93.208.171:5600/api/v1',
          description: 'Testing server'
        }
      ],
      security: [
        {
            bearerAuth: []
        }
      ],
      tags: [
        {name:'User Management'},
        {name:'OTP Management'},
        {name:'Category Management'},
        {name:'Notification Management'},
        {name:'Product Management'},
      ],
      paths: {
          "/check-username/{username}":{
              get:{
                  tags:["User Management"],
                  description: "Check username is available or not.",
                  summary: "Check username",
                  operationId: "userCheckUsername",
                  parameters: [
                      {
                          name: "username",
                          in: "path",
                          schema: {
                              type: "string",
                              description: "Username for checking",
                              example: "arvind"
                          },
                          required: true
                      }
                      ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/register":{
            post:{
                tags:["User Management"],
                description: "Register with email and password",
                summary: "With Email and password",
                operationId: "userRegister",
                requestBody:{
                    content: {
                        "application/json": {
                            schema:{
                                $ref: '#/components/schemas/User'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
        },
          "/register/verify-email-and-login":{
            post:{
                tags:["User Management"],
                description: "Verify your email",
                summary: "Verify email",
                operationId: "userRegisterVerifyEmail",
                requestBody:{
                    content: {
                        "application/json": {
                            schema:{
                                type: "object",
                                properties: {
                                    email:{
                                        type: "string"
                                    },
                                    otp: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Login Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
          },
          "/register-and-login-with/{scop}":{
            get:{
                tags:["User Management"],
                description: "Register and loin with social media",
                summary: "Register and login with social media",
                operationId: "userRegisterLoginSocial",
                parameters: [
                    {
                        name: "scop",
                        in: "path",
                        schema: {
                            type: "string",
                            description: "Login and register Scop",
                            enum:["google","facebook","twitter"],
                            example:"google"
                        },
                        required: true
                    },
                    {
                        name: "access_token",
                        in: "query",
                        schema: {
                            type: "string",
                            description: "Social media access token",
                        },
                        required: true
                    },
                    {
                        name: "fcm_token",
                        in: "query",
                        schema: {
                            type: "string",
                            description: "Firebase token",
                        }
                    },
                    {
                        name: "device_token",
                        in: "query",
                        schema: {
                            type: "string",
                            description: "Device token",
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
          },
          "/login":{
            post: {
                tags: ["User Management"],
                description: "Login with email and password",
                summary: "Login with email and password",
                operationId: "userLogin",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: '#/components/schemas/User Login'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
          },
          "/profile":{
            get:{
                tags:["User Management"],
                description: "Get current user profile",
                summary: "User Profile",
                operationId: "userProfile",
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
          },
          "/profile/{user_id}":{
              get:{
                  tags:["User Management"],
                  description: "Get user profile by id",
                  summary: "User Profile by id",
                  operationId: "userProfileUserId",
                  parameters:[
                      {
                          name:"user_id",
                          in: "path",
                          required:true,
                          schema:{
                              type:"string",
                              description: "User Id"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/update-profile":{
              post:{
                  tags:["User Management"],
                  description: "Update your profile like avatar, name, email, etc.",
                  summary: "Update Profile",
                  operationId: "updateProfile",
                  requestBody:{
                      content:{
                          "multipart/form-data":{
                              schema:{
                                  $ref: "#/components/schemas/User form-data"
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/forget-password":{
            post:{
                tags:["User Management"],
                description: "Enter your email and get verification code.",
                summary: "Forget Password",
                operationId: "userForgetPassword",
                requestBody:{
                    content:{
                        "application/json":{
                            schema:{
                                type: "object",
                                properties:{
                                    email:{type:"string"}
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Success'
                                }
                            }
                        }
                    },
                    '201': {
                        description: 'Error: Some validation or other errors.'
                    },
                    '204': {
                        description: 'Error: Not found data on the database.'
                    }
                }
            }
          },
          "/reset-password":{
              post:{
                  tags:["User Management"],
                  description: "Enter your new password.",
                  summary: "Reset Password",
                  operationId: "userResetPassword",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema:{
                                  type: "object",
                                  properties:{
                                      email: {type: "string"},
                                      password: {type: "string"}
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/follow/{user_id}":{
              get:{
                  tags:["User Management"],
                  description: "Follow and unfollow.",
                  summary: "Follow and unfollow",
                  operationId: "userFollowUnfollow",
                  parameters:[
                      {
                          name:"user_id",
                          in:"path",
                          required:true,
                          schema:{
                              type:"string"
                          },
                          description: "Fllower's id"
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-followers":{
              get:{
                  tags:["User Management"],
                  description: "Get my followers.",
                  summary: "My Followers",
                  operationId: "myFollowers",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-followers/{user_id}":{
              get:{
                  tags:["User Management"],
                  description: "Get followers by user id.",
                  summary: "My Followers by user id",
                  operationId: "myFollowersById",
                  parameters: [
                      {
                          name: "user_id",
                          in: "path",
                          required: true,
                          schema:{
                              type: "string",
                              description: "User Id"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-following":{
              get:{
                  tags:["User Management"],
                  description: "Get my following.",
                  summary: "My Following",
                  operationId: "myFollowing",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-following/{user_id}":{
              get:{
                  tags:["User Management"],
                  description: "Get following by user id.",
                  summary: "My Following user id",
                  operationId: "myFollowingById",
                  parameters: [
                      {
                          name: "user_id",
                          in: "path",
                          required: true,
                          schema:{
                              type: "string",
                              description: "User Id"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/change-password":{
              post:{
                  tags:["User Management"],
                  description: "Change password.",
                  summary: "Change password",
                  operationId: "chnagePassword",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema:{
                                  type: "object",
                                  properties:{
                                      oldpassword: {type: "string"},
                                      newpassword: {type: "string"}
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/is-followed/{user_id}":{
              get:{
                  tags:["User Management"],
                  description: "Get given user id is followed by me or not",
                  summary: "Is this user is my following.",
                  operationId: "isMyFollowingById",
                  parameters: [
                      {
                          name: "user_id",
                          in: "path",
                          required: true,
                          schema:{
                              type: "string",
                              description: "User Id"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/delete-account":{
              get:{
                  tags:["User Management"],
                  description: "Delete Your account.",
                  summary: "Delete Account",
                  operationId: "userDeleteAccount",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/verify-otp":{
              post:{
                  tags:["OTP Management"],
                  description: "Verify your email OTP",
                  summary: "Verify OTP",
                  operationId: "verifyOtp",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema:{
                                  type: "object",
                                  properties:{
                                      email: {type: "string"},
                                      otp: {type: "number"}
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/categories":{
              get:{
                  tags: ["Category Management"],
                  description: "Get list of all category",
                  summary: "Category list",
                  operationId: "getCategoryList",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/add-category":{
              post:{
                  tags: ["Category Management"],
                  description: "Add category with subcategory or with-out.",
                  summary:"Add category",
                  operationId :"addCategory",
                  requestBody:{
                      content:{
                          "multipart/form-data":{
                              schema: {
                                  $ref: "#/components/schemas/Category form-data"
                              }
                          },
                          'application/json': {
                              schema: {
                                  $ref : '#/components/schemas/Category'
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/add-sub-category/{category_id}":{
              post:{
                  tags: ["Category Management"],
                  description: "Add Sub-category.",
                  summary: "Add Sub-category",
                  operationId : "addSubCategory",
                  parameters: [
                      {
                          name:"category_id",
                          in:"path",
                          schema:{
                              type:"string"
                          },
                          required: true
                      }
                  ],
                  requestBody:{
                      content:{
                          "multipart/form-data":{
                              schema: {
                                  $ref: "#/components/schemas/Category form-data"
                              }
                          },
                          'application/json': {
                              schema: {
                                  $ref : '#/components/schemas/Sub-Category'
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/notifications":{
              get:{
                  tags:["Notification Management"],
                  description:"Get list of notification user wise.",
                  summary: "Notification list",
                  operationId: "notificationList",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/add-notification":{
              post:{
                  tags:["Notification Management"],
                  description:"Add notification.",
                  summary: "Send notification user",
                  operationId: "notificationAdd",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema:{
                                  $ref: "#/components/schemas/Notification"
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/make-read/{notification_id}":{
              get:{
                  tags:["Notification Management"],
                  description:"Update notification.",
                  summary: "Make Read notification",
                  operationId: "notificationMakeRead",
                  parameters:[
                      {
                          name:'notification_id',
                          in:"path",
                          required:true,
                          schema:{
                              type:"string"
                          },
                          description:"Notification Id"
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/products":{
              get:{
                  tags: ["Product Management"],
                  description: "Get product list.",
                  summary: "Product list with filter and search",
                  operationId : "getProductList",
                  parameters:[
                      {
                          name:"perpage",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"5"
                          }
                      },
                      {
                          name:"page",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"1"
                          }
                      },
                      {
                          name:"size_low",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"0"
                          }
                      },
                      {
                          name:"size_high",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"100"
                          }
                      },
                      {
                          name:"category",
                          in:"query",
                          schema:{
                              type:"string"
                          }
                      },
                      {
                          name:"sub_category",
                          in:"query",
                          schema:{
                              type:"string"
                          }
                      },
                      {
                          name:"price_low",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"0"
                          }
                      },
                      {
                          name:"price_high",
                          in:"query",
                          schema:{
                              type:"string",
                              example:"1500"
                          }
                      },
                      {
                          name:"condition",
                          in:"query",
                          schema:{
                              type:"string",
                              enum:["new","used","gently_used"],
                              example:"new"
                          }
                      },
                      {
                          name:"relevance",
                          in:"query",
                          schema:{
                              type:"string",
                              enum:["today","yesterday","thisweek"],
                              example:"today"
                          }
                      }
                      ,
                      {
                          name:"search",
                          in:"query",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              },
              post:{
                  tags: ["Product Management"],
                  description: "Add product.",
                  summary: "Add Product",
                  operationId : "addProduct",
                  requestBody:{
                      content:{
                          "multipart/form-data":{
                              schema: {
                                  $ref: "#/components/schemas/Product form-data"
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/product/{product_id}":{
              get:{
                  tags: ["Product Management"],
                  description: "Get product by id.",
                  summary: "Product by id",
                  operationId : "getProductById",
                  parameters:[
                      {
                          name:"product_id",
                          in:"path",
                          schema:{
                              type:"string"
                          }
                      }
                      ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/favorite-product/{product_id}":{
              get:{
                  tags: ["Product Management"],
                  description: "Add or Remove favorite product.",
                  summary: "Add product favorite list or remove.",
                  operationId : "addRFProductList",
                  parameters:[
                      {
                          name:"product_id",
                          in:"path",
                          schema:{
                              type:"string",
                          },
                          description: "Product Id"
                      }
                      ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-products":{
              get:{
                  tags: ["Product Management"],
                  description: "Get my products.",
                  summary: "Product added by me",
                  operationId : "getMyProduct",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-products/{user_id}":{
              get:{
                  tags: ["Product Management"],
                  description: "Get my products by user id.",
                  summary: "Get Product added by someone",
                  operationId : "getMyByUserProduct",
                  parameters:[
                      {
                          name: "user_id",
                          in: "path",
                          schema: {
                              type: "string",
                              description: "User Id"
                          },
                          required: true
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-favorite-products":{
              get:{
                  tags: ["Product Management"],
                  description: "Get my favorite products.",
                  summary: "My Favorite Products",
                  operationId : "getMyFavoriteProduct",
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/comment":{
              post:{
                  tags: ["Comment Management"],
                  description: "Add comment.",
                  summary: "Add comment on product or profile.",
                  operationId : "addComment",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema: {
                                  $ref: "#/components/schemas/Comment"
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/comment/{comment_id}":{
              patch:{
                  tags: ["Comment Management"],
                  description: "Update comment.",
                  summary: "Update comment on product or profile.",
                  operationId : "updatedComment",
                  parameters:[
                      {
                          name:"comment_id",
                          in:"path",
                          schema:{
                              type:"string",
                          },
                          description: "Comment Id"
                      }
                  ],
                  requestBody:{
                      content:{
                          "application/json":{
                              schema: {
                                  type:"object",
                                  properties:{
                                      comment:{
                                          type:"string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/get-comment/{type}/{option_id}":{
              get:{
                  tags: ["Comment Management"],
                  description: "Get Comment by user id or product id.",
                  summary: "Get Comment BY Id.",
                  operationId : "getComentuserProduct",
                  parameters:[
                      {
                          name:"type",
                          in:"path",
                          schema:{
                              type:"string",
                              enum:["user","product"],
                              default:"user"
                          },
                          description: "User OR Product Id"
                      },
                      {
                          name:"option_id",
                          in:"path",
                          schema:{
                              type:"string"
                          },
                          description: "If Type is user then user_id otherwise product_id"
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/make-offer":{
              post:{
                  tags: ["Offers"],
                  description: "Make offer.",
                  summary: "Make offer.",
                  operationId : "makeOffer",
                  requestBody:{
                      content:{
                          "application/json":{
                              schema: {
                                  type:"object",
                                  properties:{
                                      product_id:{
                                          type:"string",
                                          required:true
                                      },
                                      product_price:{
                                          type:"number",
                                          required:true
                                      }
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-offers/{type}":{
              get:{
                  tags: ["Offers"],
                  description: "Get offers by it's type.",
                  summary: "Get offers by it's type.",
                  operationId : "getOffer",
                  parameters:[
                      {
                          name:"type",
                          in:"path",
                          required:true,
                          description:"Offer Type",
                          schema:{
                              type:"string",
                              enum:["sent","receive"],
                              example:"sent"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/accept-offer/{offer_id}":{
              get:{
                  tags: ["Offers"],
                  description: "Accept offer",
                  summary: "Accept offer",
                  operationId : "acceptOffer",
                  parameters:[
                      {
                          name:"offer_id",
                          in:"path",
                          required:true,
                          description:"Offer ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/decline-offer/{offer_id}":{
              get:{
                  tags: ["Offers"],
                  description: "Decline offer",
                  summary: "Decline offer",
                  operationId : "declineOffer",
                  parameters:[
                      {
                          name:"offer_id",
                          in:"path",
                          required:true,
                          description:"Offer ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/make-offer-paid/{offer_id}":{
              get:{
                  tags: ["Offers"],
                  description: "Make offer paid",
                  summary: "Paid Offer",
                  operationId : "paidOffer",
                  parameters:[
                      {
                          name:"offer_id",
                          in:"path",
                          required:true,
                          description:"Offer ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/delete-offer/{offer_id}":{
              get:{
                  tags: ["Offers"],
                  description: "Delete offer",
                  summary: "Delete offer",
                  operationId : "deleteOffer",
                  parameters:[
                      {
                          name:"offer_id",
                          in:"path",
                          required:true,
                          description:"Offer ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/posts":{
              get:{
                  tags: ["Posts"],
                  description: "Get all posts",
                  summary: "Get Posts",
                  operationId : "getPost",
                  parameters:[
                      {
                          name:"category",
                          in:"query",
                          description:"Category ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              },
              post:{
                  tags: ["Posts"],
                  description: "Add posts",
                  summary: "Add Posts",
                  operationId : "addPost",
                  requestBody:{
                      content: {
                          "multipart/form-data": {
                              schema: {
                                  type: "object",
                                  properties:{
                                      images:{
                                          type:"array",
                                          items:{
                                              type: "string",
                                              format: "binary"
                                          }
                                      },
                                      title:{
                                          type:"string"
                                      },
                                      category:{
                                          type:"string"
                                      },
                                      content:{
                                          type:"string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/post/{post_id}":{
              get:{
                  tags: ["Posts"],
                  description: "Get post by id",
                  summary: "Post by id",
                  operationId : "getPostById",
                  parameters:[
                      {
                          name:"post_id",
                          in:"path",
                          required:true,
                          description:"Post ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          },
          "/my-posts/{user_id}":{
              get:{
                  tags: ["Posts"],
                  description: "Get post by user id",
                  summary: "Post by user id",
                  operationId : "getPostByUserId",
                  parameters:[
                      {
                          name:"user_id",
                          in:"path",
                          description:"User ID",
                          schema:{
                              type:"string"
                          }
                      }
                  ],
                  responses: {
                      '200': {
                          description: 'Success',
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: '#/components/schemas/Success'
                                  }
                              }
                          }
                      },
                      '201': {
                          description: 'Error: Some validation or other errors.'
                      },
                      '204': {
                          description: 'Error: Not found data on the database.'
                      }
                  }
              }
          }
      },
    components: {
        schemas: {
            "User Login":{
                type: "object",
                properties: {
                    email:{
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    fcm_token: {
                        type:"string"
                    },
                    device_token: {
                        type:"string"
                    }
                }
            },
            User: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    username: {
                        type: "string"
                    },
                    email: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    collage_name: {
                        type: "string"
                    },
                    fcm_token: {
                        type:"string"
                    },
                    device_token: {
                        type:"string"
                    }
                }
            },
            "User form-data": {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    username: {
                        type: "string"
                    },
                    email: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    collage_name: {
                        type: "string"
                    },
                    fcm_token: {
                        type:"string"
                    },
                    device_token: {
                        type:"string"
                    },
                    avatar: {
                        type: "string",
                        format: "binary"
                    }
                }
            },
            "User Update": {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    email: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    collage_name: {
                        type: "string"
                    }
                }
            },
            "Login Success":{
                type: "object",
                properties: {
                    access_token: {type:"string"},
                    token_expiry: {type: "string"},
                    msg: {type: "string"},
                    data: {
                        type: "object",
                        properties: {
                            _id:{type:"stirng"},
                            email: { type: "string"},
                            avatar: {type: "string"},
                            name: {type: "string"}
                        }
                    }
                }
            },
            Category:{
                type: "object",
                properties: {
                    name:{
                        type :"string"
                    },
                    desc:{
                        type :"string"
                    },
                    subcategories:{
                        type :"array",
                        items:{
                            type:"object",
                            properties:{
                                name:{
                                    type :"string"
                                },
                                desc:{
                                    type :"string"
                                },
                                icon:{
                                    type :"string"
                                },
                                image:{
                                    type :"string"
                                }
                            }
                        }
                    }
                }
            },
            "Category form-data":{
                type: "object",
                properties: {
                    name:{
                        type :"string"
                    },
                    desc:{
                        type :"string"
                    },
                    icon: {
                        type: "string",
                        format: "binary"
                    },
                    image: {
                        type: "string",
                        format: "binary"
                    }
                }
            },
            "Sub-Category":{
                type: "object",
                properties: {
                    name:{
                        type :"string"
                    },
                    desc:{
                        type :"string"
                    },
                    icon:{
                        type :"string"
                    },
                    image:{
                        type :"string"
                    }
                }
            },
            Notification:{
                type: "object",
                properties: {
                    receiver:{
                        type:"string",
                        description: "Receiver user id"
                    },
                    payload:{
                        type:"object"
                    }
                }
            },
            Product:{
                type:"object",
                properties:{
                    title:{
                        type:"string"
                    },
                    category:{
                        type:"object",
                        properties:{
                            "_id":{
                                type:"string"
                            },
                            name:{
                                type:"string"
                            }
                        }
                    },
                    sub_category:{
                        type:"object",
                        properties:{
                            "_id":{
                                type:"string"
                            },
                            name:{
                                type:"string"
                            }
                        }
                    },
                    size:{
                        type:"number"
                    },
                    brand:{
                        type:"string"
                    },
                    price:{
                        type:"number"
                    },
                    shipping:{
                        type:"number"
                    },
                    condition:{
                        type:"string"
                    },
                    item_description:{
                        type:"string"
                    },
                    accept_offers:{
                        type:"boolean"
                    },
                    images:{
                        type:"string"
                    },
                    user:{
                        type:"object",
                        properties:{
                            "_id":{
                                type:"string"
                            },
                            name:{
                                type:"string"
                            }
                        }
                    },
                    address:{
                        type:"string"
                    },
                    city:{
                        type:"string"
                    },
                    state:{
                        type:"string"
                    },
                    zipcode:{
                        type:"number"
                    },
                    lat:{
                        type:"number"
                    },
                    long:{
                        type:"number"
                    },
                    status:{
                        type:"string",
                        example:"Active"
                    },
                    created_at:{
                        type:"string"
                    },
                    updated_at:{
                        type:"string"
                    }
                }
            },
            "Product form-data":{
                type:"object",
                properties:{
                    title:{
                        type:"string"
                    },
                    category:{
                        type:"string",
                    },
                    sub_category:{
                        type:"string",
                    },
                    size:{
                        type:"number"
                    },
                    brand:{
                        type:"string"
                    },
                    price:{
                        type:"number"
                    },
                    shipping:{
                        type:"number"
                    },
                    condition:{
                        type:"string",
                        enum:["new","used","gently_used"],
                        example:"used"
                    },
                    item_description:{
                        type:"string"
                    },
                    accept_offers:{
                        type:"boolean"
                    },
                    images:{
                        type:"array",
                        items:{
                            type:"string",
                            format: "binary"
                        }
                    },
                    address:{
                        type:"string"
                    },
                    city:{
                        type:"string"
                    },
                    state:{
                        type:"string"
                    },
                    zipcode:{
                        type:"number"
                    },
                    lat:{
                        type:"number"
                    },
                    long:{
                        type:"number"
                    }
                }
            },
            Comment:{
                type:"object",
                properties:{
                    resource_id:{
                        type: "string"
                    },
                    type: {
                        type: "string",
                        enum: ["profile", "product"],
                        default: "product"
                    },
                    rating:{
                        type:"number"
                    },
                    comment:{
                        type: "string"
                    }
                }
            },
            Success: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["success", "error"],
                        default: "succes"
                    },
                    msg: {
                        type: "string",
                        description: "Message"
                    },
                    data: {
                        type: "array",
                        items: {},
                        description: "Current inserted data."
                    }
                }
            },

            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                    internal_code: {
                        type: 'string'
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
}
