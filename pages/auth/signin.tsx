import { signIn } from "next-auth/react";
import styles from "@/styles/Home.module.css";
import Container from "@mui/material/Container";

export default function Signin() {
  return (
    <main className={`${styles.main}`}>
      <Container style={{ alignItems: "end", justifyContent: "center" }}>
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: process.env.NEXT_PUBLIC_DEVELOPMENT_URL,
            })
          }
        >
          Sign In with Google
        </button>
      </Container>
    </main>
  );
}
