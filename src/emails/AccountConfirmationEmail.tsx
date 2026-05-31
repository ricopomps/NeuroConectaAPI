import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

type Props = Readonly<{
  email: string;
  confirmationCode: string;
}>;

export function AccountConfirmationEmail({ email, confirmationCode }: Props) {
  return (
    <EmailLayout>
      <Heading className="text-2xl font-semibold mb-4">
        Confirme seu e-mail
      </Heading>

      <Text className="mb-2">Olá,</Text>

      <Text className="mb-4">
        Recebemos um pedido para criar uma conta com o e-mail {email}.
      </Text>

      <Text className="mb-4 text-lg font-bold tracking-widest text-neutral-900">
        {confirmationCode}
      </Text>

      <Text className="mb-4">
        Use esse código no formulário de cadastro. Ele expira em breve.
      </Text>
    </EmailLayout>
  );
}
