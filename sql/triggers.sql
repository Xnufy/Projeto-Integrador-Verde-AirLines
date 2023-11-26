/TRIGGERS

	create or replace trigger trg_gerar_assentos
	
	after insert on AERONAVES 
	
	for each row
	
	declare
	
		v_num_assentos integer := 1;
	
	begin
	
		loop
		
			insert into ASSENTO_CLIENTE(id_assento,REF_ASSENTO,NUM_AERONAVE , status)
			
				values(SEQ_ASSENTO.nextval, 'A' || v_num_assentos  ,:NEW.id_aeronave , 'normal');
			
			insert into ASSENTO_CLIENTE(id_assento,REF_ASSENTO ,NUM_AERONAVE , status)
			
				values(SEQ_ASSENTO.nextval, 'B' || v_num_assentos  ,:NEW.id_aeronave , 'normal');
			
			insert into ASSENTO_CLIENTE(id_assento,REF_ASSENTO ,NUM_AERONAVE , status)
			
				values(SEQ_ASSENTO.nextval, 'C' || v_num_assentos  ,:NEW.id_aeronave , 'normal');
			
			insert into ASSENTO_CLIENTE(id_assento,REF_ASSENTO ,NUM_AERONAVE , status)
			
				values(SEQ_ASSENTO.nextval, 'D' || v_num_assentos  ,:NEW.id_aeronave , 'normal');
			
			if v_num_assentos = :NEW.linhas_assento then 
			
				exit;
			
			end if;
			
			v_num_assentos := v_num_assentos +1;
		
		end loop;
	
	END;

--------------------------------------------------------------------------------------------------------------------------------------------

	create or replace trigger trg_gerar_mapa_assentos after insert on VOOS 
	
	for each ROW
	
	begin
		
		
		FOR info IN (SELECT id_assento, ref_assento FROM ASSENTO_CLIENTE WHERE NUM_AERONAVE = :NEW.NUMERO_AVIAO)
		LOOP
			
			insert into MAPA_ASSENTO (id_assento_mapa , NUM_VOO , NUM_ASSENTO_CLIENTE, REF_ASSENTO, STATUS)
			
			values(SEQ_MAPA_ASSENTO.nextval, :NEW.ID_VOO, info.id_assento, info.ref_assento, 'livre');
		
		end loop;
	
	END;