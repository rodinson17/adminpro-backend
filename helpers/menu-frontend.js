const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {
    const menu = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            subMenu: [
                { title: 'Main', url: '/' },
                { title: 'ProgressBar', url: 'progress' },
                { title: 'Gráficas', url: 'grafica1' },
                { title: 'Promesas', url: 'promises' },
                { title: 'rxjs', url: 'rxjs' },
            ]
        },
        {
            title: 'Mantenimientos',
            icon: 'mdi mdi-folder-lock-open',
            subMenu: [
                //{ title: 'Usuarios', url: 'users' },
                { title: 'Hospitales', url: 'hospitals' },
                { title: 'Médicos', url: 'doctors' }
            ]
        }
    ];

    if ( role === 'ADMIN_ROLE' ) {
        menu[1].subMenu.unshift( { title: 'Usuarios', url: 'users' } );
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}