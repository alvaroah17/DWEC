let salir = false;

do{
    const opcionesMenu = prompt(
        "================\n"+
               "MENU\n" +
        "================\n" +
         "1. Ver catalogo\n" +
         "2. Salir\n" +
         "Elige una opcion"
    )

    switch (opcionesMenu) {
    case value: 1
        //ver catalogo
        
        break;
    case value: 2
    
        salir=true;
        break;

    default:
        console.log("ERROR: Esa opcion no esta disponible, elija 1 o 2");
    }
}while (!salir);
