/*********************************************************************
*********************  Inicio Definición Léxica  *********************
*********************************************************************/

%lex
%options case-insensitive
%option yylineno

%%
"//".*                              {/*Ignorar comentarios simples*/}
"/*"((\*+[^/*])|([^*]))*\**"*/"     {/*Ignorar comentarios multiples*/}


<INITIAL>"{"                     { console.log("Reconocido: "+yytext); return 'LLAVEA';}
<INITIAL>"}"                     { console.log("Reconocido: "+yytext); return 'LLAVEC';}
<INITIAL>"["                     { console.log("Reconocido: "+yytext); return 'CORCHA';}
<INITIAL>"]"                     { console.log("Reconocido: "+yytext); return 'CORCHC';}
<INITIAL>"("                     { console.log("Reconocido: "+yytext); return 'PARENA';}
<INITIAL>")"                     { console.log("Reconocido: "+yytext); return 'PARENC';}

<INITIAL>"."                     { console.log("Reconocido: "+yytext); return 'PUNTO';}
<INITIAL>":"                     { console.log("Reconocido: "+yytext); return 'DOSP';}
<INITIAL>","                     { console.log("Reconocido: "+yytext); return 'COMA';}
<INITIAL>";"                     { console.log("Reconocido: "+yytext); return 'PYC';}

<INITIAL>"++"                    { console.log("Reconocido: "+yytext); return 'INCCI';}
<INITIAL>"--"                    { console.log("Reconocido: "+yytext); return 'DECCI';}

<INITIAL>"+"                     { console.log("Reconocido: "+yytext); return 'SUMA';}
<INITIAL>"-"                     { console.log("Reconocido: "+yytext); return 'RESTA';}
<INITIAL>"*"                     { console.log("Reconocido: "+yytext); return 'MULT';}
<INITIAL>"/"                     { console.log("Reconocido: "+yytext); return 'DIV';}
<INITIAL>"^^"                    { console.log("Reconocido: "+yytext); return 'POW';}
<INITIAL>"%"                     { console.log("Reconocido: "+yytext); return 'MOD';}

<INITIAL>"=="                    { console.log("Reconocido: "+yytext); return 'IGUALIGUAL';}
<INITIAL>"!="                    { console.log("Reconocido: "+yytext); return 'DIF';}

<INITIAL>"&&"                    { console.log("Reconocido: "+yytext); return 'AND';}
<INITIAL>"||"                    { console.log("Reconocido: "+yytext); return 'OR';}
<INITIAL>"!"                     { console.log("Reconocido: "+yytext); return 'NOT';}
<INITIAL>"^"                     { console.log("Reconocido: "+yytext); return 'XOR';}


<INITIAL>"<="                    { console.log("Reconocido: "+yytext); return 'MENORIQ';}
<INITIAL>"<"                     { console.log("Reconocido: "+yytext); return 'MENORQ';}
<INITIAL>">="                    { console.log("Reconocido: "+yytext); return 'MAYORIQ';}
<INITIAL>">"                     { console.log("Reconocido: "+yytext); return 'MAYORQ';}

<INITIAL>"="                     { console.log("Reconocido: "+yytext); return 'IGUAL';}

<INITIAL>"import"                { console.log("Reconocido: "+yytext); return 'IMPORT';}

<INITIAL>"double"                { console.log("Reconocido: "+yytext); return 'DOUBLE';}
<INITIAL>"integer"               { console.log("Reconocido: "+yytext); return 'INTEGER';}
<INITIAL>"boolean"               { console.log("Reconocido: "+yytext); return 'BOOLEAN';}
<INITIAL>"char"                  { console.log("Reconocido: "+yytext); return 'CHAR';}
<INITIAL>"string"                { console.log("Reconocido: "+yytext); return 'STRING';}
<INITIAL>"strc"                  { console.log("Reconocido: "+yytext); return 'STRC';}

<INITIAL>"global"                  { console.log("Reconocido: "+yytext); return 'GLOBAL';}
<INITIAL>"const"                  { console.log("Reconocido: "+yytext); return 'CONST';}
<INITIAL>"var"                  { console.log("Reconocido: "+yytext); return 'VAR';}

<INITIAL>"if"                    { console.log("Reconocido: "+yytext); return 'IF';}
<INITIAL>"else"                  { console.log("Reconocido: "+yytext); return 'ELSE';}
<INITIAL>"switch"                { console.log("Reconocido: "+yytext); return 'SWITCH';}
<INITIAL>"case"                  { console.log("Reconocido: "+yytext); return 'CASE';}
<INITIAL>"break"                 { console.log("Reconocido: "+yytext); return 'BREAK';}
<INITIAL>"default"               { console.log("Reconocido: "+yytext); return 'DEFAULT';}

<INITIAL>"do"                    { console.log("Reconocido: "+yytext); return 'DO';}
<INITIAL>"while"                 { console.log("Reconocido: "+yytext); return 'WHILE';}
<INITIAL>"for"                   { console.log("Reconocido: "+yytext); return 'FOR';}
<INITIAL>"continue"              { console.log("Reconocido: "+yytext); return 'CONTINUE';}

<INITIAL>"try"                   { console.log("Reconocido: "+yytext); return 'TRY';}
<INITIAL>"catch"                 { console.log("Reconocido: "+yytext); return 'CATCH';}
<INITIAL>"throw"                 { console.log("Reconocido: "+yytext); return 'THROW';}

<INITIAL>"public"                { console.log("Reconocido: "+yytext); return 'PUBLIC';}

<INITIAL>"void"                  { console.log("Reconocido: "+yytext); return 'VOID';}
<INITIAL>"return"                { console.log("Reconocido: "+yytext); return 'RETURN';}

<INITIAL>"print"                 { console.log("Reconocido: "+yytext); return 'PRINT';}
<INITIAL>"instanceof"            { console.log("Reconocido: "+yytext); return 'INSTANCEOF';}
<INITIAL>"toString"              { console.log("Reconocido: "+yytext); return 'TOSTRING';}
<INITIAL>"length"                { console.log("Reconocido: "+yytext); return 'LENGTH';}
<INITIAL>"toUpperCase"           { console.log("Reconocido: "+yytext); return 'TOUPPERCASE';} 
<INITIAL>"toLowerCase"           { console.log("Reconocido: "+yytext); return 'TOLOWERCASE';} 
<INITIAL>"toCharArray"           { console.log("Reconocido: "+yytext); return 'TOCHARARRAY';} 

<INITIAL>"null"                  { console.log("Reconocido: "+yytext); return 'NULL';}
<INITIAL>"true"                  { console.log("Reconocido: "+yytext); return 'TRUE';}
<INITIAL>"false"                 { console.log("Reconocido: "+yytext); return 'FALSE';}

<INITIAL>[a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*   { console.log("Reconocido identificador: "+yytext); return 'ID';}
<INITIAL>[0-9]+"."[0-9]+              { console.log("Reconocido double: "+yytext); return 'DEC';}
<INITIAL>[0-9]+                       { console.log("Reconocido integer: "+yytext); return 'NUM';}
<INITIAL>("'")[a-zA-Z0-9]("'")        { console.log("Reconocido caracter: "+yytext); return 'CAR';}
<INITIAL>\"[^"]*\"                    { yytext= yytext.slice(1,-1); console.log("Reconocido cadena: "+yytext); return 'CAD';}




[\s\r\n\p]                          {/*Ignorar espacios*/}


.  {    
    var ob = new Object(); ob.tipo = "Lexico"; ob.linea = yylloc.first_line; ob.columna = (yylloc.first_column+1); ob.descripcion = "Caracter '" + yytext +"' no reconocido.";
    
    TS.TS_Errores.push(ob); 
    console.log('Error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
   }


<<EOF>>                           {return 'EOF';}




/lex
/************************************************************************
*********************  Inicio Definición Sintctica  *********************
************************************************************************/
%left 'ID'
%right 'IGUAL'
%right 'OR'
%left 'XOR'
%right 'AND'
%left 'NOT'
%left 'IGUALIGUAL' 'DIF'
%nonassoc 'MENORIQ' 'MENORQ' 'MAYORIQ' 'MAYORQ' 'INSTANCEOF'
%left 'SUMA' 'RESTA'
%left 'MULT' 'DIV' 'POW' 'MOD'
%right 'PARENA' tipo 'PARENC' 'NEW' 
%left 'CORCHA' 'CORCHC' 'PUNTO' 'PARENA' 'PARENC'
%right 'INCCI' 'DECCI'
%left UMENOS

%start  inicio
%%


inicio : inst EOF {return $1;}
        ;



inst    : import_list cuerpo_global       -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
        | cuerpo_global                    -> new Nodo_1($1, @1.first_line, @1.last_column+1);       
        ;



import_list : import_list IMPORT CAD PYC         -> new Nodo_3($1, $2, $3, @3.first_line, @3.last_column+1);
            | IMPORT CAD PYC                     -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
            ;



cuerpo_global : cuerpo_global global        { $1.push($2); $$ = $1; }
              | global                      { $$ = new Nodo_1($1, @1.first_line, @1.last_column+1); }
              ;

global : tipo_retorno opt_global              -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);             
        ;


opt_global : lista_declaraciones PYC          -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
            | metodos                         -> $1;
            ;




lista_declaraciones : lista_declaraciones COMA tipo_declaracion assig     {var n = new Nodo_2($3,$4, @4.first_line, @4.last_column+1); $1.push(n); $$ = $1;}
                    | lista_declaraciones COMA tipo_declaracion           {var n = new Nodo_1($3, @3.first_line, @3.last_column+1); $1.push(n); $$ = $1;}   
                    | tipo_declaracion assig                               
                        {
                            var n = new Nodo_1("", @2.first_line, @2.last_column+1);
                            var n1 = new Nodo_2($1, $2,@2.first_line, @2.last_column+1);  
                            n.pop();
                            n.push(n1);
                            $$ = n;   
                        }
                    | tipo_declaracion                                    {var n = new Nodo_1($1, @1.first_line, @1.last_column+1); $$ = n;}
                    ;


tipo_declaracion : ID CORCHA opt_decla                                  -> new Nodo_3(c.constantes.T_ARREGLO,$1, $3, @1.first_line, @1.last_column+1);
                 | ID                                                   -> new Nodo_1($1, @1.first_line, @1.last_column+1);
                 ;


opt_decla   : CORCHC                                                    -> new Nodo_1($1, @1.first_line, @1.last_column+1);
            ;





opt_assig : CORCHA opt_decla assig                          -> new Nodo_2($2, $3, @1.first_line, @1.last_column+1);
          | assig                                           -> $1;            
          ;
                    
assig : IGUAL inicializador_var                   -> $2;
      | arrays IGUAL COND                         -> new Nodo_3(c.constantes.T_ACCESOARRAYS, $1, $3, @1.first_line, @1.last_column+1);
      | ACCESOS IGUAL COND                        -> new Nodo_3(c.constantes.T_ACCESOOBJETO, $1, $3, @1.first_line, @1.last_column+1);    
      ;  

inicializador_var : COND                                    -> $1;
                  | inicializador_array                     -> $1;
                  ;

inicializador_array : STRC tipo_retorno opt_instancia        -> new Nodo_3(c.constantes.T_INSTANCIA, $2, $3, @3.first_line, @3.last_column+1);
                    | LLAVEA opt_arrays                     -> new Nodo_2(c.constantes.T_ARRAYS, $2, @2.first_line, @2.last_column+1); //inicializacion de arreglos
                    ;

opt_instancia : arrays                                      -> new Nodo_2(c.constantes.T_ARRAYS, $1, @1.first_line, @1.last_column+1); //instancia de arreglos
              //| LLAMADA                                    -> new Nodo_1(c.constantes.T_OBJETO, $1, @1.first_line, @1.last_column+1); //instancia de una clase
              | CORCHA CORCHC                             -> new Nodo_1($2, @2.first_line, @2.last_column+1);
              ;

opt_arrays : LLAVEC                     -> $1;
           | opt_dimen LLAVEC           -> $1;
           ;

opt_dimen : opt_dimen COMA EXP            {var n = new Nodo_1($3, @1.first_line, @1.last_column+1); $1.push(n); $$ = $1;}
          | EXP                         -> new Nodo_1($1, @1.first_line, @1.last_column+1);
          ;

arrays : CORCHA EXP CORCHC              -> new Nodo_1($2, @2.first_line, @2.last_column+1);
       //| CORCHA CORCHC                  -> new Nodo_1($2, @2.first_line, @2.last_column+1);
       ;







metodos : tipo_metodo  t_parametros LLAVEA opt_metodos              -> new Nodo_3($1, $2, $4, @3.first_line, @3.last_column+1);  
        ;

tipo_metodo : CORCHA dimen_metodo ID PARENA                         -> new Nodo_2($2, $3, @3.first_line, @3.last_column+1); 
            | ID PARENA                                             -> new Nodo_1($1, @1.first_line, @1.last_column+1);
            ;

dimen_metodo : CORCHC                                               -> new Nodo_1($1, @1.first_line, @1.last_column+1);
            ;           
            
            
t_parametros : PARENC                                               -> $1;
             | parametros PARENC                                    -> $1;
             ;

parametros : parametros COMA parametro                                  {$1.push($3); $$ = $1;}
           | parametro                                               -> new Nodo_1($1, @1.first_line, @1.last_column+1);
           ;

parametro : tipo_retorno tipo_declaracion                            -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
          ;         
     
     
tipo_retorno : VOID       -> $1;
             | tipo       -> $1;
             | ID         -> $1;
             ;

tipo : INTEGER    -> $1;
     | DOUBLE     -> $1;
     | CHAR       -> $1;         
     | BOOLEAN    -> $1;
     | STRING     -> $1;                
     ;            
                    
            



opt_metodos   : cuerpo_local LLAVEC      -> $1;
              | LLAVEC                   -> $1;
              ;


cuerpo_local : cuerpo_local local                           { $1.push($2); $$ = $1;}
             | local                                          -> new Nodo_1($1, @1.first_line, @1.last_column+1);
             ;


local   : tipo_retorno lista_declaraciones PYC           -> new Nodo_3(c.constantes.T_DECLARACION,$1,$2,@1.first_line, @1.last_column+1);
        | ID opt_assig PYC                               -> new Nodo_3(c.constantes.T_ASIGNACION,$1, $2, @2.first_line, @2.last_column+1); //asignaciones 
        | BREAK PYC                                      -> new Nodo_1(c.constantes.T_BREAK, @1.first_line, @1.last_column+1);
        | CONTINUE PYC                                   -> new Nodo_1(c.constantes.T_CONTINUE, @1.first_line, @1.last_column+1);
        | RETURN opt_return                              -> new Nodo_2(c.constantes.T_RETURN, $2, @2.first_line, @2.last_column+1);
        | sentencias_seleccion                           -> $1; //IF, SWITCH 
        | sentencias_ciclicas                            -> $1; //WHILE
        | ID PUNTO ACCESOS PYC                           -> new Nodo_3(c.constantes.T_ACCESOOBJETO, $1, $3, @1.first_line, @1.last_column+1);           
        | THROW EXP PYC                                  -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
        | TRY LLAVEA cuerpo_global LLAVEC opt_catch      -> new Nodo_3($1, $3, $5, @5.first_line, @5.last_column+1);
        | PRINT PARENA EXP PARENC PYC                    -> new Nodo_2(c.constantes.T_PRINT, $3, @3.first_line, @3.last_column+1);
        | LLAMADA PYC                                    -> new Nodo_2(c.constantes.T_LLAMADA,$1, @1.first_line, @1.last_column+1);
        | ID INCCI PYC                                   {var n = new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1); $$ = new Nodo_2(c.constantes.T_INCCD, n, @2.first_line, @2.last_column+1);}
        | ID DECCI PYC                                   {var n = new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1); $$ = new Nodo_2(c.constantes.T_DECCD, n, @2.first_line, @2.last_column+1);}
        | error PYC
        ;


opt_catch   : CATCH PARENA ID ID PARENC LLAVEA cuerpo_local LLAVEC      ->new Nodo_3($3, $4, $7, @7.first_line, @7.last_column+1);
;


opt_return : PYC                -> $1;
           | COND PYC           -> $1;
;








sentencias_seleccion : sentencia_IF                 -> $1;
                     | sentencia_SWITCH             -> $1;
                     ;


sentencia_IF : IF PARENA COND PARENC LLAVEA cuerpo_local if_list                -> new Nodo_4(c.constantes.T_IF,$3, $6, $7, @6.first_line, @6.last_column+1);
             ;


if_list : LLAVEC ELSE IF PARENA COND PARENC LLAVEA cuerpo_local if_list         -> new Nodo_4(c.constantes.T_IFELSE, $5, $8, $9, @8.first_line, @8.last_column+1); 
        | LLAVEC ELSE LLAVEA cuerpo_local LLAVEC                                -> new Nodo_2(c.constantes.T_ELSE,$4, @4.first_line, @4.last_column+1);
        | LLAVEC                                                                 -> $1;                                     
        ;


sentencia_SWITCH : SWITCH PARENA EXP PARENC LLAVEA OPT_SWITCH                   ->new Nodo_3(c.constantes.T_SWITCH,$3, $6, @6.first_line, @6.last_column+1);
                 ;

OPT_SWITCH : LLAVEC                             ->$1;
           | cuerpo_SWITCH LLAVEC               ->$1;
           ;

cuerpo_SWITCH : cuerpo_SWITCH cases                                              {$1.push($2); $$ = $1;}
              | cases                                                            ->new Nodo_1($1, @1.first_line, @1.last_column+1);
              ;

cases  : cases_list cuerpo_local                                                 ->new Nodo_2($1, $2, @1.first_line, @1.last_column+1);
       ;

cases_list  : cases_list CASE EXP DOSP                                           {$1.push($3); $$ = $1;}
            | cases_list DEFAULT DOSP                                            {$1.push($2); $$ = $1;}
            | CASE EXP DOSP                                                     ->new Nodo_1($2, @2.first_line, @2.last_column+1);
            | DEFAULT DOSP                                                      ->new Nodo_1($1, @1.first_line, @1.last_column+1);
            ;






sentencias_ciclicas : sentencia_WHILE           -> $1;
                    | sentencia_DOWHILE         -> $1;
                    | sentencia_FOR             -> $1;
                    ;

sentencia_WHILE : WHILE PARENA COND PARENC LLAVEA cuerpo_local LLAVEC               ->new Nodo_3(c.constantes.T_WHILE, $3, $6, @6.first_line, @6.last_column+1);
                ;

sentencia_DOWHILE : DO LLAVEA cuerpo_local LLAVEC WHILE PARENA COND PARENC PYC      ->new Nodo_3(c.constantes.T_DOWHILE, $3, $7, @7.first_line, @7.last_column+1);
                  ;

sentencia_FOR : FOR PARENA for_init tipo_FOR                                        ->new Nodo_3(c.constantes.T_FOR, $3, $4, @4.first_line, @4.last_column+1);
              ;

for_init : tipo_retorno lista_declaraciones                                         ->new Nodo_3(c.constantes.T_DECLARACION,$1, $2, @2.first_line, @2.last_column+1);
         | ID assig                                                                 ->new Nodo_3(c.constantes.T_ASIGNACION,$1, $2, @2.first_line, @2.last_column+1);
         ;


tipo_FOR : PYC COND PYC EXP PARENC LLAVEA cuerpo_local LLAVEC                       ->new Nodo_3($2, $4, $7, @7.first_line, @7.last_column+1);//for normal 
         | DOSP EXP PARENC LLAVEA cuerpo_local LLAVEC                               ->new Nodo_2($2, $5, @5.first_line, @5.last_column+1);//foreach
         ;








LLAMADA : ID PARENA OPT_LLAMADA                 ->new Nodo_3(c.constantes.T_LLAMADA,$1, $3, @3.first_line, @3.last_column+1);
        | ID arrays                             ->new Nodo_3(c.constantes.T_ARRAYS,$1, $2, @2.first_line, @2.last_column+1);     
        ;

OPT_LLAMADA : PARENC                            ->$1;
            | exp_params PARENC                 ->$1;
            ;

exp_params : exp_params COMA EXP                {$1.push($3); $$ = $1;} 
           | EXP                                 -> new Nodo_1($1, @1.first_line, @1.last_column+1);
           ;







ACCESOS : ACCESOS PUNTO OPT_ACCESOS                  {$1.push($3); $$ = $1;}
        | OPT_ACCESOS                                -> new Nodo_1($1, @1.first_line, @1.last_column+1);
        ;


OPT_ACCESOS : LLAMADA                                ->new Nodo_1($1, @1.first_line, @1.last_column+1);
            | ID                                     ->new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1);         
            | SIZE PARENA PARENC                     ->new Nodo_1(c.constantes.T_SIZE, @1.first_line, @1.last_column+1);                       
            | TOSTRING PARENA PARENC                 ->new Nodo_1(c.constantes.T_TOSTRING, @1.first_line, @1.last_column+1);
            | LENGTH                                 ->c.constantes.T_LENGTH;
            | TOCHARARRAY PARENA PARENC              ->new Nodo_1(c.constantes.T_TOCHARARRAY, @1.first_line, @1.last_column+1);
            | LENGTH PARENA PARENC                   ->new Nodo_1(c.constantes.T_STRINGLENGTH, @1.first_line, @1.last_column+1);
            | TOUPPERCASE PARENA PARENC              ->new Nodo_1(c.constantes.T_TOUPPERCASE, @1.first_line, @1.last_column+1);
            | TOLOWERCASE PARENA PARENC              ->new Nodo_1(c.constantes.T_TOLOWERCASE, @1.first_line, @1.last_column+1);
            ;






COND : COND AND COND                            ->new Nodo_3(c.constantes.T_AND, $1, $3, @3.first_line, @3.last_column+1);
     | COND OR COND                             ->new Nodo_3(c.constantes.T_OR, $1, $3, @3.first_line, @3.last_column+1);
     | NOT COND                                 ->new Nodo_2(c.constantes.T_NOT, $2, @2.first_line, @2.last_column+1);
     | COND XOR COND                            ->new Nodo_3(c.constantes.T_XOR, $1, $3, @3.first_line, @3.last_column+1);
     | ID PUNTO INSTANCEOF PARENA ID PARENC     ->new Nodo_3(c.constantes.T_INSTANCEOF, $1, $5, @3.first_line, @3.last_column+1);
     | REL                                      ->$1;
     ;


REL  : REL IGUALIGUAL REL             ->new Nodo_3(c.constantes.T_IGUALIGUAL, $1, $3, @3.first_line, @3.last_column+1);
     | REL MAYORQ REL                 ->new Nodo_3(c.constantes.T_MAYORQ, $1, $3, @3.first_line, @3.last_column+1);
     | REL MENORQ REL                 ->new Nodo_3(c.constantes.T_MENORQ, $1, $3, @3.first_line, @3.last_column+1);
     | REL MAYORIQ REL                ->new Nodo_3(c.constantes.T_MAYORIQ, $1, $3, @3.first_line, @3.last_column+1);    
     | REL MENORIQ REL                ->new Nodo_3(c.constantes.T_MENORIQ, $1, $3, @3.first_line, @3.last_column+1);
     | REL DIF REL                    ->new Nodo_3(c.constantes.T_DIF, $1, $3, @3.first_line, @3.last_column+1);
     | EXP                            ->$1;
     ;


EXP : RESTA EXP  %prec UMENOS         ->new Nodo_2(c.constantes.T_UNARIO, $2, @2.first_line, @2.last_column+1);
    | EXP SUMA EXP                    ->new Nodo_3(c.constantes.T_SUMA, $1, $3, @3.first_line, @3.last_column+1);
    | EXP RESTA EXP                   ->new Nodo_3(c.constantes.T_RESTA, $1, $3, @3.first_line, @3.last_column+1);
    | EXP MULT EXP                    ->new Nodo_3(c.constantes.T_MULT, $1, $3, @3.first_line, @3.last_column+1);    
    | EXP DIV EXP                     ->new Nodo_3(c.constantes.T_DIV, $1, $3, @3.first_line, @3.last_column+1);
    
    | EXP POW EXP                     ->new Nodo_3(c.constantes.T_POW, $1, $3, @3.first_line, @3.last_column+1);
    | EXP MOD EXP                     ->new Nodo_3(c.constantes.T_MOD, $1, $3, @3.first_line, @3.last_column+1);
        
    | EXP INCCI                       ->new Nodo_2(c.constantes.T_INCCD, $1, @2.first_line, @2.last_column+1);
    | EXP DECCI                       ->new Nodo_2(c.constantes.T_DECCD, $1, @2.first_line, @2.last_column+1);

    | PARENA COND PARENC              ->$2;
    
    | STRC LLAMADA                    ->new Nodo_2(c.constantes.T_OBJETO, $2, @2.first_line, @2.last_column+1);
    | LLAMADA                         ->$1; 
  
    | NUM                             ->new Nodo_2(c.constantes.T_ENTERO,$1, @1.first_line, @1.last_column+1);                    
    | DEC                             ->new Nodo_2(c.constantes.T_DECIMAL,$1, @1.first_line, @1.last_column+1);
    | CAR                             ->new Nodo_2(c.constantes.T_CARACTER,$1, @1.first_line, @1.last_column+1);
    | ID                              ->new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1);
    | CAD                             ->new Nodo_2(c.constantes.T_CADENA,$1, @1.first_line, @1.last_column+1);
    | TRUE                            ->new Nodo_2(c.constantes.T_BOOLEANO,$1, @1.first_line, @1.last_column+1);
    | FALSE                           ->new Nodo_2(c.constantes.T_BOOLEANO,$1, @1.first_line, @1.last_column+1);
    | NULL                            ->new Nodo_2(c.constantes.T_NULL,$1, @1.first_line, @1.last_column+1);
    
    ;






%%

var TS = require("../Arbol/TS");
var c  = require("../Arbol/constants");


function Nodo_1(nodo, linea, columna){
    nodo.linea = linea;
    nodo.columna = columna;   
    this.lista = [nodo];
    
    return this.lista;
}


function Nodo_2(n1, n2, linea, columna){
    this.lista = [n1];
    n2.linea = linea;
    n2.columna = columna;
    this.lista.push(n2);
    
    return this.lista;
}


function Nodo_3(n1, n2, n3, linea, columna){
    this.lista = [n1];
    
    this.lista.push(n2);
    
    n3.linea = linea;
    n3.columna = columna;
    this.lista.push(n3);
    
    return this.lista;    
}


function Nodo_4(n1,n2,n3,n4, linea, columna){
    this.lista = [n1];
    
    this.lista.push(n2);
    this.lista.push(n3);
    
    n4.linea = linea;
    n4.columna = columna;
    this.lista.push(n4);
    
    return this.lista;
}

