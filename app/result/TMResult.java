
package result;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.codehaus.jackson.annotate.JsonProperty;

import com.ciaosir.client.pojo.PageOffset;

@JsonAutoDetect
public class TMResult {

    @JsonProperty
    public boolean isOk = true;

    @JsonProperty
    public int pn;

    @JsonProperty
    public int ps;

    @JsonProperty
    public int count;

    @JsonProperty
    public int pnCount;

    @JsonProperty
    public String msg;

    @JsonProperty
    public Object res;

    public TMResult(String msg) {
        this.isOk = false;
        this.msg = msg;
    }

    public TMResult(boolean isOk, int pn, int ps, int count, String msg, Object res) {
        super();
        this.isOk = isOk;
        this.pn = pn;
        this.ps = ps;
        this.count = count;
        this.msg = msg;
        this.res = res;
    }

    public TMResult(List list, int count, PageOffset po) {
        this.isOk = true;
        this.pn = po.getPn();
        this.ps = po.getPs();
        this.count = count;
        this.pnCount = (count + ps - 1) / ps;
        this.res = list;
    }

    public TMResult(boolean isOk, String msg, Object res) {
        this.isOk = isOk;
        this.msg = msg;
        this.res = res;
    }

    public TMResult(Object res) {
        this.isOk = true;
        this.msg = StringUtils.EMPTY;
        this.res = res;
    }

    public TMResult() {
        super();
    }

    public static TMResult OK = new TMResult();

    public static TMResult failMsg(String msg) {
        return new TMResult(msg);
    }

    public static TMResult renderMsg(String msg) {
        if (StringUtils.isEmpty(msg)) {
            return new TMResult();
        } else {
            return new TMResult(msg);
        }
    }

    @JsonAutoDetect
    public static class TMListResult<T> extends TMResult {
        @JsonProperty
        protected List<T> res;

        public TMListResult(List<T> list, int count, PageOffset po) {
            this.isOk = true;
            this.pn = po.getPn();
            this.ps = po.getPs();
            this.count = count;
            this.pnCount = (count + ps - 1) / ps;
            this.res = list;
        }
    }
}
