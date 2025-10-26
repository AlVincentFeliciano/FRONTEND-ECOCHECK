import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import client from "../api/client";

const SignupScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [displayContactNumber, setDisplayContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSignup = async () => {
    let newErrors: {[key: string]: string} = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!contactNumber) newErrors.contactNumber = "Contact number is required";
    if (contactNumber && contactNumber.length !== 10) newErrors.contactNumber = "Mobile number must be exactly 10 digits";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await client.post("/auth/register", {
        firstName,
        middleInitial,
        lastName,
        email,
        contactNumber: `0${contactNumber}`, // Convert 9926492991 to 09926492991 (PH format)
        password,
      });

      if (res.data.success && res.data.requiresVerification) {
        // Navigate to verification screen with email
        Alert.alert(
          "Check Your Email",
          "A verification code has been sent to your email. Please check your inbox.\n\n⚠️ Note: First-time emails may go to spam/junk folder.",
          [
            {
              text: "OK",
              onPress: () => (navigation as any).navigate("VerifyEmail", { email }),
            },
          ]
        );
      } else if (res.data.token) {
        // Fallback for old flow (shouldn't happen with new implementation)
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login" as never);
      }
    } catch (err: any) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => [
    styles.input,
    errors[field] ? { borderColor: "red" } : {},
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={inputStyle("firstName")}
        placeholder="First Name"
        placeholderTextColor="#555"
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Middle Initial (optional)"
        placeholderTextColor="#555"
        value={middleInitial}
        onChangeText={setMiddleInitial}
        maxLength={1}
      />

      <TextInput
        style={inputStyle("lastName")}
        placeholder="Last Name"
        placeholderTextColor="#555"
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

      <TextInput
        style={inputStyle("email")}
        placeholder="Email"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={styles.contactContainer}>
        <Text style={styles.countryCode}>+63</Text>
        <TextInput
          style={[inputStyle("contactNumber"), styles.contactInput]}
          placeholder="Mobile Number (e.g., 912 345 6789)"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={displayContactNumber}
          onChangeText={(text) => {
            // Remove all non-numeric characters and spaces
            const numericText = text.replace(/[^0-9]/g, '');
            
            // Limit to 10 digits
            if (numericText.length <= 10) {
              setContactNumber(numericText);
              
              // Format with spaces: 3-3-4 pattern
              let formatted = numericText;
              if (numericText.length > 3) {
                formatted = numericText.slice(0, 3) + ' ' + numericText.slice(3);
              }
              if (numericText.length > 6) {
                formatted = numericText.slice(0, 3) + ' ' + numericText.slice(3, 6) + ' ' + numericText.slice(6);
              }
              
              setDisplayContactNumber(formatted);
            }
          }}
          maxLength={12} // 10 digits + 2 spaces
        />
      </View>
      {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

      <TextInput
        style={inputStyle("password")}
        placeholder="Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={inputStyle("confirmPassword")}
        placeholder="Confirm Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  countryCode: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  contactInput: {
    flex: 1,
    marginBottom: 0,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    marginTop: 15,
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default SignupScreen;
