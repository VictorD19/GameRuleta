def mensaje_recuperacion_senha(nombreCliente, nombreSite, clave ):
    return f"""
            <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Clave</title>
</head>
<body style="font-family: Arial, sans-serif;">

    <p>Olá {nombreCliente},</p>

    <p style="text-align: justify;">Este mensagem de recuperação de senha foi originado em {nombreSite}, sua nova senha gerada aleatoriamente é a seguinte:</p>

    <h2 style="text-align: center; font-weight: bold;">{clave}</h2>

    <p style="text-align: justify;">Este mensagem é gerado automaticamente. Não é necessário responder, pois esta é uma conta não monitorada.</p>

</body>
</html>
            """