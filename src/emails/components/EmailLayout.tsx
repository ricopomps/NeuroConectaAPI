import { Body, Container, Html } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function EmailLayout({ children }: Props) {
  return (
    <Html>
      <Body className="bg-gray-100 font-sans">
        <Tailwind config={{ theme: { extend: {} } }}>
          <Container className="bg-white p-8 max-w-xl mx-auto rounded-lg">
            {children}
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
