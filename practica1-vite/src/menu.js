let salir = false;

do{
    do{
        const opcionesMenu = prompt(
        "================\n"+
               "MENU\n" +
         "================\n" +
         "1. Ver catalogo\n" +
         "2. Salir\n" +
         "Elige una opcion"
        )

        if (opcionesMenu !=1 && opcionesMenu!=2 ) {
            console.log("ERROR: Esa opcion no esta disponible, elija 1 o 2");
        }

    }while(opcionesMenu !=1 && opcionesMenu!=2)

    switch (opcionesMenu) {
    case value: 1
        
        break;
    case value: 2
    
        salir=true;
        break;

    default:
        break;
    }
}while (!salir):
