'use client';

export default function NucleoGestao() {
    return (
        <div className="w-full h-full flex flex-1 flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    Bem-vindo ao Núcleo de Gestão
                </h1>
                <p className="text-muted-foreground">
                    Aqui você pode gerenciar seus leads e acompanhar o progresso das suas negociações.
                    <br />
                    Selecione uma opção no menu lateral para começar.
                </p>
            </div>
        </div>
    );
}