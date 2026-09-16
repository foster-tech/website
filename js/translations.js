$(function() {

    var t = {
            "Play background video": {
              es: "Reproducir vídeo",
              pt: "Reproduzir vídeo",
            },
            "Loading background video...": {
              es: "Cargando vídeo de fondo...",
              pt: "Carregando vídeo de fundo...",
            },
            "Tap Play to start the background video.": {
              es: "Toque Reproducir para iniciar el vídeo de fondo.",
              pt: "Toque em Reproduzir para iniciar o vídeo de fundo.",
            },
            "Video unavailable. Showing a still background.": {
              es: "Vídeo no disponible. Mostrando un fondo estático.",
              pt: "Vídeo indisponível. Exibindo um fundo estático.",
            },
            services_intro: {
              en: "We specialize in developing digital products and services, from the first prototype to operating at scale.",
              es: "Somos especialistas en el desarrollo de productos y servicios digitales, desde el primer prototipo hasta la operación a escala.",
              pt: "Somos especializados no desenvolvimento de produtos e serviços digitais, do primeiro protótipo à operação em escala.",
            },
            "Mobile apps": {
              en: "Mobile apps",
              es: "Apps móviles",
              pt: "Apps mobile",
            },
            "Welcome to": { 
              es: "Bienvenido a",
              pt: "Bem-vindo a",
             },
            "Technology is the means.": {
              es: "Tecnología es el medio.",
              pt: "Tecnologia é o meio.",
             },
            "Intelligence is the path.": {
              es: "Inteligencia es el camino.",
              pt: "Inteligência é o caminho.",
             },
            "Impact is the result.": {
              es: "Impacto es el resultado.",
              pt: "Impacto é o resultado.",
             },
            "Know more": { 
              es: "Conozca más",
              pt: "Saiba mais" },
            "Schedule a meeting with us": { 
              es: "Agenda tu reunión con nosotros",
              pt: "Agende sua reunião conosco" },
            "Services": { 
              es: "Servicios",
              pt: "Serviços" },
            "Know what we do": { 
              es: "Nosotros somos especializados en desarrollo de productos y servicios digitales",
              pt: "Somos especializados no desenvolvimento de produtos e serviços digitais",
             },
            "Portfolio": { 
              es: "Portafolio",
              pt: "Portfólio" },
            "Know our work": { 
              es: "Conozca nuestro trabajo",
              pt: "Conheça o nosso trabalho" },
            "Clients": { 
              es: "Clientes",
              pt: "Clientes" },
            "Automation": { 
              es: "Automatización",
              pt: "Automatização" },
            service_1: {
              en: "We automate and digitize existing processes in your company, eliminating repetitive manual work.",
              es: "Automatizamos y digitalizamos los procesos existentes en su empresa, eliminando el trabajo manual repetitivo.",
              pt: "Automatizamos e digitalizamos processos existentes na sua empresa, eliminando trabalho manual repetitivo.",
            },
            "Development": { 
              es: "Desarrollo", 
              pt: "Desenvolvimento", 
            },
            service_2: {
              en: "We develop your ideas and help your business grow through apps and websites built to last.",
              es: "Desarrollamos sus ideas y ayudamos a hacer crecer su negocio, a través de apps y páginas web construidas para durar.",
              pt: "Desenvolvemos as suas ideias e ajudamos a fazer crescer o seu negócio, através de apps e páginas web construídas para durar.",
            },
            "Agile methodology": { 
              es: "Metodología Ágil",
              pt: "Metodologia Ágil",
             },
            service_3: {
              en: "Agility is our secret to delivering products on time, with short cycles and constant feedback.",
              es: "La agilidad es nuestro secreto para entregar productos a tiempo, con ciclos cortos y feedback constante.",
              pt: "Agilidade é o nosso segredo para entregar produtos no prazo, com ciclos curtos e feedback constante.",
            },
            portfolio_1 : { 
              en: "Resposive web platform to the biggest event of Creative Economy" ,
              es: "Plataforma web responsiva para el más grande evento de Economía Creativa" ,
              pt: "Plataforma web responsiva para o maior evento de Economia Criativa",
            },
            portfolio_2 : { 
              en: "Web System to project evaluations and grade calculation" ,
              es: "Sistema web para evaluación de proyectos y calculo de notas" ,
              pt: "Sistema web para avaliação de projectos e cálculo de notas" ,
            },
            portfolio_3 : { 
              en: "Smart delivery and route management in real time.",
              es: "Gestión inteligente de entregas y rutas en tiempo real.",
              pt: "Gestão inteligente de entregas e rotas em tempo real.",
            },
            portfolio_4 : { 
              en: "Automated student payment collection via WhatsApp.",
              es: "Automatización de cobros a estudiantes vía WhatsApp.",
              pt: "Automação de cobranças de alunos via WhatsApp.",
            },
            portfolio_5 : { 
              en: "Web system for Real Estate Agents" ,
              es: "Herramienta web para corredores Real Estate" ,
              pt: "Ferramenta Web para Corretores de Imóveis",
            },
            portfolio_6 : { 
              en: "Marketplace for Companies and Freelancers" ,
              es: "1º Marketplace para Proyectos y Servicios de Rep. Dominicana" ,
              pt: "1º Marketplace de Projetos e Serviços da República Dominicana",
            },
            "Our clients": { 
              es: "Nuestros clientes", 
              pt: "Nossos clientes",
            },
            "that trust us": { 
              es: "que confian en nosotros",
              pt: "quem confia em nós",
             },
            "Send Message": { 
              es: "Enviar",
              pt: "Enviar",
             },
            "Thanks": { 
              es: "Gracias",
              pt: "Obrigado",
             },
            "Privacy Policy": { 
              es: "Política de Privacidad",
              pt: "Política de Privacidade",
             },
            "Terms of Use": { 
              es: "Terminos y Condiciones",
              pt: "Termos e Condições",
             },
            
          };
          // Set default as PT
          var _t = $('body').translate({lang: "pt", t: t});
          var str = _t.g("translate");
          console.log(str);
        
          // This is for Placeholder translations
          var dictionary = {
            "en": {
                "name_placeHolder" : "Your name",
                "email_placeHolder" : "Your e-mail",
                "phone_placeHolder" : "Your phone",
                "message_placeHolder" : "Your message",
              },
              "es": {
                "name_placeHolder" : "Nombre",
                "email_placeHolder" : "E-mail",
                "phone_placeHolder" : "Telefono",
                "message_placeHolder" : "Mensaje",
            }
          };
        
          var set_lang = function (dictionary) {
              $("[data-translate]").each(function(){
                if($(this).is( "input" ) || $(this).is( "textarea" )){
                    $(this).attr('placeholder',dictionary[$(this).data("translate")] )
                } else{
                  console.log("AQUI");
                    $(this).text(dictionary[$(this).data("translate")])
                }
              })
          };
        
          // Set default as PT
          set_lang(dictionary.pt);
    
          $(".lang_selector").click(function(ev) {
            var lang = $(this).attr("data-value");
            _t.lang(lang);
            console.log(lang);
        
            ev.preventDefault();
            if (dictionary.hasOwnProperty(lang)) {
                set_lang(dictionary[lang]);
            }
          });
        
      });
