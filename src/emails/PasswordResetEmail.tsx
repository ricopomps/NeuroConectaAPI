import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

type Props = Readonly<{
  name?: string;
  resetLink: string;
}>;

export function PasswordResetEmail({ name, resetLink }: Props) {
  return (
    <EmailLayout>
      <Heading className="text-2xl font-semibold mb-4">Troca de senha</Heading>

      <Text className="mb-2">Olá {name ?? "usuário"},</Text>

      <Text className="mb-4">
        Recebemos uma solicitação para redefinir sua senha.
      </Text>

      <Button
        href={resetLink}
        className="bg-neutral-900 text-white px-4 py-2 rounded-md no-underline block w-max mb-4"
      >
        Trocar senha
      </Button>

      <Text className="text-sm text-gray-600">Este link expira em 1 hora.</Text>
    </EmailLayout>
  );
}
