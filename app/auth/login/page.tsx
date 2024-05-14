import LoginForm from "./_components/login-form";
import React from "react";

const AuthLogin = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          आफ्नो प्रमाणहरु संग लगइन गर्नुहोस्{" "}
        </h1>
        <p className="text-sm text-muted-foreground">तल आफ्नो इमेल प्रविष्ट गर्नुहोस्</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default AuthLogin;
