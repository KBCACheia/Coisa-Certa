$(function(){

	var numeroPerguntas = 2;
	var respostas = [];
	var indexPergunta = 0;
	var dbPerguntas;
	var perguntasRepetidas = [];
	var respostasPerguntas = [];
	var countPerg = 0;
	var perguntasSorteadas = [];
	var erradas = 0;
	var ponteiro = 0; /*Receberá o index aleátório pra usar na resposta*/
	
	/* colocando json em variavel*/
	$.getJSON("js/perguntas.json", function(json){
		dbPerguntas = json;
	});
	


	function carregarPergunta() {/*carregar as perguntas*/	
		
		var index = randomInt(0, dbPerguntas.length - 1);
		perguntasSorteadas.push(index);
		$('#redPerguntas').html(dbPerguntas[index].pergunta);
		$('#alternativa-0').html("a) "+dbPerguntas[index].alternativas[0]);
		$('#alternativa-1').html("b) "+dbPerguntas[index].alternativas[1]);
		$('#alternativa-2').html("c) "+dbPerguntas[index].alternativas[2]);
		$('#imagens').attr('src',dbPerguntas[index].imagemPadrao);
		respostasPerguntas[countPerg] = dbPerguntas[index].resposta;
		ponteiro = index;
		countPerg++;		
	}
	
	function randomInt(min, max){ /*gera o index randomico e confere se já foi usado*/
			var index = -1;
			do {
				index = Math.floor(Math.random()*(max-min+1)+min);
				for(i = 0; i < perguntasRepetidas.length; i++){
					if(perguntasRepetidas[i] == index){
						index = -1;
					}
					else {
						perguntasRepetidas[i] = index;
						break;
					}
				}
			}while(index < 0)
			return index;
	}
		
	function gabarito(){ /* criar o gabarito */
		var gabaritoCompleto="";
		var letra = "";
		for (i = 0; i < perguntasSorteadas.length; i++){
			var questao = perguntasSorteadas[i];
			
			function trocaLetra(resp){ /*troca os números pelas letras das questões*/
				if (resp == 0){
					letra = "a"; 
				}
				if (resp == 1){
					letra = "b"; 
				}
				if (resp == 2){
					letra = "c";
				}
				return letra;
			}
			
			if (dbPerguntas[questao].resposta != respostas[i]){ /* muda cor da fonte caso a resposta do usuário esteja errada*/
				estilo = "style='color:red'";
				suaResposta = "<br><span style='color:black'>Sua resposta foi: <strong>" + trocaLetra(respostas[i])+")</strong> " + dbPerguntas[questao].alternativas[respostas[i]] + "</span>"; /*chama o metodo trocaletra para exibição correta e exibe a resposta na posição do vetor respostas[] na posição da respectiva pergunta.*/
			} else {
				estilo = "";
				suaResposta = "";
			}
			
			gabaritoCompleto = gabaritoCompleto + "<li "+estilo+"><p style='align:justify;'><strong>"+dbPerguntas[questao].pergunta + " Qual a coisa certa a fazer?" + "</strong></p><p><strong>Resposta:</strong> " /*Concatenação do gabarito*/
													+ trocaLetra(dbPerguntas[questao].resposta)+") " +dbPerguntas[questao].alternativas[dbPerguntas[questao].resposta] + suaResposta + "<hr/><br></p></li>";
		}
		$("#cpGabarito").html(gabaritoCompleto);
	}
	
	$("#btComecar").click(function(){ /* botão Começar chama o metodo para carregar a pergunta e zera todos os vetores*/
		erradas=0;
		respostas = [];
		indexPergunta = 0;
		perguntasRepetidas = [];
		respostasPerguntas = [];
		countPerg = 0;
		perguntasSorteadas = [];
		numeroPerguntas = 2;
		ponteiro = 0;		
		carregarPergunta();
		$("input[name='radio-choice-v-2']").attr("checked", false);
		$('#formulario').each (function(){ /*apaga a marcação do radio buttom*/
			this.reset();
		});
	});	
	
	
	$("#btProxima").click(function(){ /* botão Proxima chama o metodo para carregar a pergunta*/
		if (! $("input[name='radio-choice-v-2']").is(':checked')){
			$('#txPopup').html("<img src='css/images/tranq.png'/> Você precisa escolher uma!");
			$( "#popupQuestao" ).popup( "open" );
		} else {
			if ($("input[name='radio-choice-v-2']:checked").val()!= dbPerguntas[ponteiro].resposta){ /*verificar a marcada para exibir msg ao usuário*/
				$('#txPopup').html("<img src='css/images/okay.png'/>Ops, é melhor tentar outra!");
				$( "#popupQuestao" ).popup( "open" );
				$('#alternativa-'+ $("input[name='radio-choice-v-2']:checked").val()).append("<img src='css/images/okay.png' style='float:right; height:30px; margin:-8px;'/>");/*marca a errada*/
				erradas++;
				
			} else {
				$('#txPopup').html("<img src='css/images/happy.png'/> Parabéns, você acertou!");/*popup parabéns*/
				$( "#popupQuestao" ).popup( "open" );
				
				var resposta = $("input[name='radio-choice-v-2']:checked").val();
				respostas[indexPergunta] = resposta;
				indexPergunta++;
				if (indexPergunta == numeroPerguntas-1){ /*altera valor do botão*/
					$("#btProxima").html('Concluir');
				}
				if (indexPergunta == numeroPerguntas){ /*mostra resultado*/
					erradas++;
					$.mobile.changePage( "#resultado", { transition: "flip"});
					$("#redResultado").html( "Você acertou todas perguntas em " + erradas + " tentativas.<br>" + (erradas == 10 ? "<h1>Parabéns!</h1><br><img src='css/images/proud.png'/><br>Estamos muito orgulhosos de você!" : 
																																			(erradas <= 20 ? "<h1>Você foi bem!</h1><br><img src='css/images/ucan.png'/><br>Mas você pode fazer melhor!" : 
																																				(erradas <= 30 ? "<h1>Essa foi boa!</h1><br><img src='css/images/boa.png'/><br>Vamos tentar de novo?" :  
																																					"<h1>Atenção!</h1><br><img src='css/images/atencao.png'/><br>Se você olhar direitinho verá que é fácil."))));
					gabarito();
				} else {
					carregarPergunta();
					erradas++;
					$("input[name='radio-choice-v-2']").attr("checked", false);
					$('#formulario').each (function(){ /*apaga a marcação do radio buttom*/
						this.reset();
					});
				}
				
			}
		}
	});
	
	$("#btParar").click(function(){ /*retorna para página inicial*/
		$.mobile.changePage( "#inicio", { transition: "flip"});
	});
	
	$("#btContinua").click(function(){ /*inicia o processo de geração de perguntas*/
		indexPergunta = 0;
		ponteiro=0;
		respostas = [];
		respostasPerguntas = [];
		perguntasSorteadas = [];		
		carregarPergunta();
		$("#btProxima").html('Próxima');
		$('#formulario').each (function(){ /*apaga a marcação do radio buttom*/
			this.reset();
		});
	});	
	
	$("input[name='radio-choice-v-2']").click(function(){ /*troca imagem*/
		if ($("input[name='radio-choice-v-2']:checked").val()== dbPerguntas[ponteiro].resposta){
			$('#imagens').fadeOut(function() {
				$(this).attr("src",dbPerguntas[ponteiro].imagemCerta).fadeIn();
			  });
		}
	});

});