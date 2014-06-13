package controllers;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;

import play.*;
import play.mvc.*;
@Check("admin")
@With(Secure.class)
public class Users extends CRUD{

}
