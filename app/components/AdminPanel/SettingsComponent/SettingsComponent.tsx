"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { FiUser, FiLock, FiBell, FiSettings, FiUsers } from "react-icons/fi";

export const SettingsComponent: React.FC = () => {
  const [profile, setProfile] = useState({
    username: "admin",
    email: "admin@example.com",
    firstName: "John",
    lastName: "Doe",
    jobTitle: "System Administrator",
    department: "IT",
    phoneNumber: "+1 (555) 123-4567",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailFrequency: "daily",
    notificationTypes: {
      systemUpdates: true,
      securityAlerts: true,
      userActivity: false,
      performanceReports: true,
    },
  });

  const [appSettings, setAppSettings] = useState({
    appName: "Üskümenzade",
    theme: "light",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    features: {
      featureX: true,
      featureY: false,
      featureZ: true,
    },
    analytics: {
      googleAnalytics: true,
      mixpanel: false,
      hotjar: true,
    },
  });

  const [userManagement, setUserManagement] = useState({
    userRoles: ["Admin", "Manager", "User"],
    invitationEnabled: true,
    maxUsersAllowed: 100,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  });

  // Dummy functions to use the setters
  const updateProfile = useCallback(() => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      name: "John Doe",
      email: "john@example.com",
    }));
  }, []);

  const updatePassword = useCallback(() => {
    setPassword((prevPassword) => ({
      ...prevPassword,
      currentPassword: "********",
      newPassword: "********",
    }));
  }, []);

  const updateNotifications = useCallback(() => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      emailNotifications: true,
      pushNotifications: false,
    }));
  }, []);

  const updateAppSettings = useCallback(() => {
    setAppSettings((prevAppSettings) => ({
      ...prevAppSettings,
      theme: "dark",
      language: "en",
    }));
  }, []);

  const updateUserManagement = useCallback(() => {
    setUserManagement((prevUserManagement) => ({
      ...prevUserManagement,
      users: ["user1", "user2", "user3"],
    }));
  }, []);

  // Use the update functions
  useEffect(() => {
    // Simulate updates when the component mounts
    updateProfile();
    updatePassword();
    updateNotifications();
    updateAppSettings();
    updateUserManagement();
  }, [
    updateProfile,
    updatePassword,
    updateNotifications,
    updateAppSettings,
    updateUserManagement,
  ]);

  // Handler functions
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void e; // Explicitly acknowledge the parameter
    // Implementation
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void e; // Explicitly acknowledge the parameter
    // Implementation
  };

  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    void e; // Explicitly acknowledge the parameter
    // Implementation
  };

  const handleAppSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    void e; // Explicitly acknowledge the parameter
    // Implementation
  };

  const handleUserManagementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    void e; // Explicitly acknowledge the parameter
    // Implementation
  };

  const handleSubmit = (section: string) => (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for each section
    console.log(`${section} settings updated`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <Tab.Group vertical>
            <div className="md:shrink-0 bg-gray-800 text-white p-6">
              <h2 className="text-2xl font-semibold mb-6">Settings</h2>
              <Tab.List className="flex flex-col space-y-2">
                <Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-gray-700 ui-not-selected:text-gray-300 px-4 py-2 rounded-md focus:outline-none">
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    Profile
                  </div>
                </Tab>
                <Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-gray-700 ui-not-selected:text-gray-300 px-4 py-2 rounded-md focus:outline-none">
                  <div className="flex items-center">
                    <FiLock className="mr-2" />
                    Security
                  </div>
                </Tab>
                <Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-gray-700 ui-not-selected:text-gray-300 px-4 py-2 rounded-md focus:outline-none">
                  <div className="flex items-center">
                    <FiBell className="mr-2" />
                    Notifications
                  </div>
                </Tab>
                <Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-gray-700 ui-not-selected:text-gray-300 px-4 py-2 rounded-md focus:outline-none">
                  <div className="flex items-center">
                    <FiSettings className="mr-2" />
                    App Settings
                  </div>
                </Tab>
                <Tab className="ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-gray-700 ui-not-selected:text-gray-300 px-4 py-2 rounded-md focus:outline-none">
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    User Management
                  </div>
                </Tab>
              </Tab.List>
            </div>

            <div className="p-8 w-full">
              <Tab.Panels>
                <Tab.Panel>
                  <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
                  <form
                    onSubmit={handleSubmit("profile")}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={profile.username}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={profile.jobTitle}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={profile.department}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <h3 className="text-2xl font-bold mb-6">Security Settings</h3>
                  <form
                    onSubmit={handleSubmit("security")}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={password.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={password.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={password.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <h3 className="text-2xl font-bold mb-6">
                    Notification Settings
                  </h3>
                  <form
                    onSubmit={handleSubmit("notifications")}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={notifications.emailNotifications}
                            onChange={handleNotificationChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Email Notifications
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="smsNotifications"
                            checked={notifications.smsNotifications}
                            onChange={handleNotificationChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            SMS Notifications
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={notifications.pushNotifications}
                            onChange={handleNotificationChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Push Notifications
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Frequency
                        </label>
                        <select
                          name="emailFrequency"
                          value={notifications.emailFrequency}
                          onChange={handleNotificationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Notification Types
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(notifications.notificationTypes).map(
                            ([key, value]) => (
                              <label key={key} className="flex items-center">
                                <input
                                  type="checkbox"
                                  name={`notificationTypes.${key}`}
                                  checked={value}
                                  onChange={handleNotificationChange}
                                  className="form-checkbox h-5 w-5 text-blue-500"
                                />
                                <span className="ml-2 text-gray-700">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update Notification Settings
                      </button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <h3 className="text-2xl font-bold mb-6">
                    Application Settings
                  </h3>
                  <form
                    onSubmit={handleSubmit("appSettings")}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Application Name
                        </label>
                        <input
                          type="text"
                          name="appName"
                          value={appSettings.appName}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Theme
                        </label>
                        <select
                          name="theme"
                          value={appSettings.theme}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          name="language"
                          value={appSettings.language}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={appSettings.timezone}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">EST</option>
                          <option value="PST">PST</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date Format
                        </label>
                        <select
                          name="dateFormat"
                          value={appSettings.dateFormat}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Format
                        </label>
                        <select
                          name="timeFormat"
                          value={appSettings.timeFormat}
                          onChange={handleAppSettingsChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="12h">12-hour</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-2">Features</h4>
                      <div className="space-y-2">
                        {Object.entries(appSettings.features).map(
                          ([key, value]) => (
                            <label key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`features.${key}`}
                                checked={value}
                                onChange={handleAppSettingsChange}
                                className="form-checkbox h-5 w-5 text-blue-500"
                              />
                              <span className="ml-2 text-gray-700">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-2">Analytics</h4>
                      <div className="space-y-2">
                        {Object.entries(appSettings.analytics).map(
                          ([key, value]) => (
                            <label key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`analytics.${key}`}
                                checked={value}
                                onChange={handleAppSettingsChange}
                                className="form-checkbox h-5 w-5 text-blue-500"
                              />
                              <span className="ml-2 text-gray-700">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update Application Settings
                      </button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <h3 className="text-2xl font-bold mb-6">
                    User Management Settings
                  </h3>
                  <form
                    onSubmit={handleSubmit("userManagement")}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Roles
                      </label>
                      <div className="space-y-2">
                        {userManagement.userRoles.map((role, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={role}
                              onChange={(e) => {
                                const newRoles = [...userManagement.userRoles];
                                newRoles[index] = e.target.value;
                                setUserManagement({
                                  ...userManagement,
                                  userRoles: newRoles,
                                });
                              }}
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newRoles =
                                  userManagement.userRoles.filter(
                                    (_, i) => i !== index
                                  );
                                setUserManagement({
                                  ...userManagement,
                                  userRoles: newRoles,
                                });
                              }}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserManagement({
                            ...userManagement,
                            userRoles: [
                              ...userManagement.userRoles,
                              "New Role",
                            ],
                          });
                        }}
                        className="mt-2 text-blue-500 hover:text-blue-700"
                      >
                        Add Role
                      </button>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="invitationEnabled"
                          checked={userManagement.invitationEnabled}
                          onChange={handleUserManagementChange}
                          className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <span className="ml-2 text-gray-700">
                          Enable User Invitations
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Users Allowed
                      </label>
                      <input
                        type="number"
                        name="maxUsersAllowed"
                        value={userManagement.maxUsersAllowed}
                        onChange={handleUserManagementChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Password Policy
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="passwordPolicy.requireUppercase"
                            checked={
                              userManagement.passwordPolicy.requireUppercase
                            }
                            onChange={handleUserManagementChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Require Uppercase
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="passwordPolicy.requireLowercase"
                            checked={
                              userManagement.passwordPolicy.requireLowercase
                            }
                            onChange={handleUserManagementChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Require Lowercase
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="passwordPolicy.requireNumbers"
                            checked={
                              userManagement.passwordPolicy.requireNumbers
                            }
                            onChange={handleUserManagementChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Require Numbers
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="passwordPolicy.requireSpecialChars"
                            checked={
                              userManagement.passwordPolicy.requireSpecialChars
                            }
                            onChange={handleUserManagementChange}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Require Special Characters
                          </span>
                        </label>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Password Length
                          </label>
                          <input
                            type="number"
                            name="passwordPolicy.minLength"
                            value={userManagement.passwordPolicy.minLength}
                            onChange={handleUserManagementChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update User Management Settings
                      </button>
                    </div>
                  </form>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};
