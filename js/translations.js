$(function() {

    var t = {
            "Welcome to": { 
              es: "Bienvenido a",
              pt: "Bem-vindo a",
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
            service_1 : { 
              en: "We automate and digitize existing processes in your company.",
              es: "Automatizamos y digitalizamos los procesos existentes en su empresa.", 
              pt: "Automatizamos e digitalizamos processos existentes na sua empresa.",
            },
            "Development": { 
              es: "Desarrollo", 
              pt: "Desenvolvimento", 
            },
            service_2 : { 
              en: "We develop your ideas and help you to grow your business, through APPs and websites." ,
              es: "Desarrollamos sus ideas y le ayudamos a crecer sus negocios, a través de APPs y páginas web." ,
              pt: "Desenvolvemos as suas ideias e ajudamos a fazer crescer o seu negócio, através de APPs e páginas web." ,
            },
            "Agile methodology": { 
              es: "Metodología Ágil",
              pt: "Metodologia Ágil",
             },
            service_3 : { 
              en: "Agilility is our secret to deliver products on time and with quality." ,
              es: "Agilidad es nuestro secreto para entregar los productos en tiempo y con calidad." ,
              pt: "Agilidade é o nosso segredo para entregar produtos no prazo e com qualidade." ,
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
              en: "Mobile Application for Project Management" ,
              es: "Applicación Móvil para manejo de proyectos" ,
              pt: "Aplicação móvel para gerenciamento de projetos",
            },
            portfolio_4 : { 
              en: "Marketplace for Projects and Investors" ,
              es: "Marketplace web responsivo para Proyectos y Inversores" ,
              pt: "Marketplace Web Responsivo para Projetos e Investidores",
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