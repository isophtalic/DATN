DROP TABLE IF EXISTS sec_logs;

create table
    sec_logs (
        sec_id UUID not null,
        created_at TIMESTAMPTZ not null,
        client_ip TEXT not null,
        host TEXT not null,
        method TEXT not null,
        proto TEXT not null,
        uri TEXT not null,
        headers TEXT not null,
        body text not null,
        form TEXT not null,
        mess TEXT not null,
        rule_id integer not null,
        secure_logs TEXT not null
    );

select
    create_hypertable (
        'sec_logs',
        'created_at',
        chunk_time_interval = > INTERVAL '1 day'
    );