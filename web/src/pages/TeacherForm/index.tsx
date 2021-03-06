import React from "react";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";

import "./styles.css";

export default function TecherForm() {
    return (
        <div id="page-teacher-form" className="container">
            <PageHeader
                title="Que incrível que você quer dar aulas."
                description="O primeiro passo é preencher esse formulário de descrição."
            />
            <main>
                <fieldset>
                    <legend>Seus Dados</legend>
                    <Input name="name" label="Nome Completo" />
                    <Input name="avatar" label="Avatar" />
                    <Input name="whatsapp" label="WhatsApp" />
                </fieldset>
            </main>
        </div>
    );
}
