import FormInput from "../../elements/Input";

const LoginFragment = () => {
  return (
    <>
      <FormInput
      name={"email"}
      inputPlaceholder={"Email Address"}
      inputType={"email"}
      isRequired={true}
      >
        Email Address
      </FormInput>
  
      <FormInput
      name={"password"}
      inputPlaceholder={"Password"}
      inputType={"password"}
      isRequired={true}
      >
        Password
      </FormInput>
    </>
  );
};

export default LoginFragment;
