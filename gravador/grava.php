<?php  
//PEGA OS DADOS ENVIADOS PELO FORMULÁIO 
$pergunta = "{\r\n".'"pergunta": "'.$_POST["pergunta"].'?"'; 
$opcao1 = "\r\n".'"alternativas": ["'.$_POST["opcao1"].'"';
$opcao2 = "\r\n".'"'.$_POST["opcao2"].'"'; 
$opcao3 = "\r\n".'"'.$_POST["opcao3"].'"]'; 
$resposta = "\r\n".'"resposta": '.$_POST["resposta"]; 
$imagemP = "\r\n".'"imagemPadrao": "images/'.$_POST["imagem"].'.jpg"'; 
$imagemC = "\r\n".'"imagemCerta": "images/'.$_POST["imagem"].'c.jpg"'."\r\n},\r\n";

//PREPARA O CONTEÚDO A SER GRAVADO 
$conteudo = "$pergunta,$opcao1,$opcao2,$opcao3,$resposta,$imagemP,$imagemC"; 

//ARQUIVO TXT 
$arquivo = "arquivo.json"; 

//TENTA ABRIR O ARQUIVO TXT 
if (!$abrir = fopen($arquivo, "a")) { 
echo "Erro abrindo arquivo ($arquivo)"; 
exit; 
} 

//ESCREVE NO ARQUIVO TXT 
if (!fwrite($abrir, $conteudo)) { 
print "Erro escrevendo no arquivo ($arquivo)"; 
exit; 
} 

echo "Arquivo gravado com Sucesso !!"; 

//FECHA O ARQUIVO  
fclose($abrir); 

echo "<meta http-equiv='refresh' content='5'; url='gravador.html'>";
?>

