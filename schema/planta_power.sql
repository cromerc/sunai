create table planta_power
(
    id              bigint auto_increment,
    id_i            int not null,
    active_power_im int not null,
    division        int not null,
    primary key (id)
);
