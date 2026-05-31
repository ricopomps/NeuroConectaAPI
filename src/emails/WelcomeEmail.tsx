import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

type Props = Readonly<{
  name?: string;
  loginLink: string;
}>;

export function WelcomeEmail({ name, loginLink }: Props) {
  return (
    <EmailLayout>
      <Heading className="text-2xl font-semibold mb-4">
        Bem-vindo ao sistema
      </Heading>

      <Text className="mb-2">Olá {name ?? ""},</Text>

      <Text className="mb-4">Sua conta foi criada com sucesso.</Text>

      <Button
        href={loginLink}
        className="bg-neutral-900 text-white px-4 py-2 rounded-md no-underline block w-max"
      >
        Acessar o sistema
      </Button>
    </EmailLayout>
  );
}
