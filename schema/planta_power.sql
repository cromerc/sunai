create table planta_power
(
    id              bigint auto_increment,
    id_i            int not null,
    fecha_im        datetime not null,
    active_power_im int not null,
    division        float not null,
    primary key (id)
);
