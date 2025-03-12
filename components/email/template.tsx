import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface ForgotPasswordEmailProps {
  username?: string
  resetPasswordUrl?: string
  expiryTime?: string
}

export const ForgotPasswordEmail = ({
  username = "User",
  resetPasswordUrl = "https://example.com/reset-password?token=123456789",
  expiryTime = "1 hour",
}: ForgotPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for your account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            We received a request to reset your password. Use the button below to set a new password:
          </Text>
          <Section style={buttonContainer}>
          <Button style={{ ...button, paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12 }} href={resetPasswordUrl}>
            Reset Password
            </Button>
          </Section>
          <Text style={text}>This password reset link will expire in {expiryTime}.</Text>
          <Text style={text}>If you didn't request a password reset, you can safely ignore this email.</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This email was sent from{" "}
            <Link href="https://example.com" style={link}>
              Example Company
            </Link>
            . If you have any questions, please contact our support team at support@example.com.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ForgotPasswordEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  borderRadius: "4px",
  maxWidth: "520px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#5850ec",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "24px",
}

const link = {
  color: "#5850ec",
  textDecoration: "underline",
}

