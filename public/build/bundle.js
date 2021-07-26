
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
    }
    function upper_bound(low, high, key, value) {
        // Return first index of value larger than input value in the range [low, high)
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (key(mid) <= value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
    }
    function init_hydrate(target) {
        if (target.hydrate_init)
            return;
        target.hydrate_init = true;
        // We know that all children have claim_order values since the unclaimed have been detached
        const children = target.childNodes;
        /*
        * Reorder claimed children optimally.
        * We can reorder claimed children optimally by finding the longest subsequence of
        * nodes that are already claimed in order and only moving the rest. The longest
        * subsequence subsequence of nodes that are claimed in order can be found by
        * computing the longest increasing subsequence of .claim_order values.
        *
        * This algorithm is optimal in generating the least amount of reorder operations
        * possible.
        *
        * Proof:
        * We know that, given a set of reordering operations, the nodes that do not move
        * always form an increasing subsequence, since they do not move among each other
        * meaning that they must be already ordered among each other. Thus, the maximal
        * set of nodes that do not move form a longest increasing subsequence.
        */
        // Compute longest increasing subsequence
        // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
        const m = new Int32Array(children.length + 1);
        // Predecessor indices + 1
        const p = new Int32Array(children.length);
        m[0] = -1;
        let longest = 0;
        for (let i = 0; i < children.length; i++) {
            const current = children[i].claim_order;
            // Find the largest subsequence length such that it ends in a value less than our current value
            // upper_bound returns first greater value, so we subtract one
            const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
            p[i] = m[seqLen] + 1;
            const newLen = seqLen + 1;
            // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
            m[newLen] = i;
            longest = Math.max(newLen, longest);
        }
        // The longest increasing subsequence of nodes (initially reversed)
        const lis = [];
        // The rest of the nodes, nodes that will be moved
        const toMove = [];
        let last = children.length - 1;
        for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
            lis.push(children[cur - 1]);
            for (; last >= cur; last--) {
                toMove.push(children[last]);
            }
            last--;
        }
        for (; last >= 0; last--) {
            toMove.push(children[last]);
        }
        lis.reverse();
        // We sort the nodes being moved to guarantee that their insertion order matches the claim order
        toMove.sort((a, b) => a.claim_order - b.claim_order);
        // Finally, we move the nodes
        for (let i = 0, j = 0; i < toMove.length; i++) {
            while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
                j++;
            }
            const anchor = j < lis.length ? lis[j] : null;
            target.insertBefore(toMove[i], anchor);
        }
    }
    function append(target, node) {
        if (is_hydrating) {
            init_hydrate(target);
            if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
                target.actual_end_child = target.firstChild;
            }
            if (node !== target.actual_end_child) {
                target.insertBefore(node, target.actual_end_child);
            }
            else {
                target.actual_end_child = node.nextSibling;
            }
        }
        else if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating && !anchor) {
            append(target, node);
        }
        else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Components\UserProfile.svelte generated by Svelte v3.38.3 */

    const { Object: Object_1 } = globals;
    const file$1 = "src\\Components\\UserProfile.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p0;
    	let t1_value = /*player*/ ctx[0].displayName + "";
    	let t1;
    	let t2;
    	let p1;

    	let t3_value = ((/*player*/ ctx[0]?.guild?.tag?.text)
    	? `[${/*player*/ ctx[0].guild.tag.text}]`
    	: "") + "";

    	let t3;
    	let t4;
    	let hr;
    	let hr_class_value;
    	let t5;
    	let div1;
    	let span0;
    	let p2;
    	let t7;
    	let p3;
    	let t8_value = /*player*/ ctx[0].level.toLocaleString() + "";
    	let t8;
    	let t9;
    	let span1;
    	let p4;
    	let t11;
    	let p5;
    	let t12_value = (/*player*/ ctx[0].karma.toLocaleString() ?? 0) + "";
    	let t12;
    	let t13;
    	let span2;
    	let p6;
    	let t15;
    	let p7;
    	let t16_value = /*player*/ ctx[0].friends.toLocaleString() + "";
    	let t16;
    	let t17;
    	let span3;
    	let p8;
    	let t19;
    	let p9;
    	let t20_value = (capitalFirst(/*player*/ ctx[0]?.lastGame?.replace(/_/, " ")) ?? "Hidden") + "";
    	let t20;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			div1 = element("div");
    			span0 = element("span");
    			p2 = element("p");
    			p2.textContent = "Level:";
    			t7 = space();
    			p3 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			span1 = element("span");
    			p4 = element("p");
    			p4.textContent = "Karma:";
    			t11 = space();
    			p5 = element("p");
    			t12 = text(t12_value);
    			t13 = space();
    			span2 = element("span");
    			p6 = element("p");
    			p6.textContent = "Friends:";
    			t15 = space();
    			p7 = element("p");
    			t16 = text(t16_value);
    			t17 = space();
    			span3 = element("span");
    			p8 = element("p");
    			p8.textContent = "Last Game:";
    			t19 = space();
    			p9 = element("p");
    			t20 = text(t20_value);
    			if (img.src !== (img_src_value = "https://minotar.net/helm/" + /*player*/ ctx[0].displayName + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "head svelte-xdly9k");
    			attr_dev(img, "alt", "head");
    			attr_dev(img, "onerror", "this.src='../Assets/steve.png'");
    			add_location(img, file$1, 32, 12, 1029);
    			attr_dev(p0, "class", "username svelte-xdly9k");
    			attr_dev(p0, "style", /*cssVars*/ ctx[1]);
    			add_location(p0, file$1, 33, 12, 1171);
    			attr_dev(p1, "class", "guild svelte-xdly9k");
    			attr_dev(p1, "style", /*cssVars*/ ctx[1]);
    			add_location(p1, file$1, 34, 12, 1245);
    			attr_dev(div0, "class", "top svelte-xdly9k");
    			add_location(div0, file$1, 31, 8, 998);

    			attr_dev(hr, "class", hr_class_value = "divider " + (/*player*/ ctx[0].displayName == "I_Like_Cats__"
    			? "dev"
    			: "default") + " svelte-xdly9k");

    			attr_dev(hr, "style", /*cssVars*/ ctx[1]);
    			add_location(hr, file$1, 38, 8, 1525);
    			attr_dev(p2, "class", "type svelte-xdly9k");
    			add_location(p2, file$1, 42, 16, 1692);
    			attr_dev(p3, "class", "number svelte-xdly9k");
    			add_location(p3, file$1, 43, 16, 1736);
    			attr_dev(span0, "class", "svelte-xdly9k");
    			add_location(span0, file$1, 41, 12, 1668);
    			attr_dev(p4, "class", "type svelte-xdly9k");
    			add_location(p4, file$1, 46, 16, 1848);
    			attr_dev(p5, "class", "number karma svelte-xdly9k");
    			add_location(p5, file$1, 47, 16, 1892);
    			attr_dev(span1, "class", "svelte-xdly9k");
    			add_location(span1, file$1, 45, 12, 1824);
    			attr_dev(p6, "class", "type svelte-xdly9k");
    			add_location(p6, file$1, 50, 16, 2015);
    			attr_dev(p7, "class", "number svelte-xdly9k");
    			add_location(p7, file$1, 51, 16, 2061);
    			attr_dev(span2, "class", "svelte-xdly9k");
    			add_location(span2, file$1, 49, 12, 1991);
    			attr_dev(p8, "class", "type svelte-xdly9k");
    			add_location(p8, file$1, 54, 16, 2175);
    			attr_dev(p9, "class", "number svelte-xdly9k");
    			add_location(p9, file$1, 55, 16, 2223);
    			attr_dev(span3, "class", "svelte-xdly9k");
    			add_location(span3, file$1, 53, 12, 2151);
    			attr_dev(div1, "class", "stats svelte-xdly9k");
    			add_location(div1, file$1, 40, 8, 1635);
    			attr_dev(div2, "class", "card svelte-xdly9k");
    			add_location(div2, file$1, 30, 4, 970);
    			attr_dev(div3, "class", "wrapper svelte-xdly9k");
    			add_location(div3, file$1, 29, 0, 943);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, p0);
    			append_dev(p0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			append_dev(p1, t3);
    			append_dev(div2, t4);
    			append_dev(div2, hr);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, p2);
    			append_dev(span0, t7);
    			append_dev(span0, p3);
    			append_dev(p3, t8);
    			append_dev(div1, t9);
    			append_dev(div1, span1);
    			append_dev(span1, p4);
    			append_dev(span1, t11);
    			append_dev(span1, p5);
    			append_dev(p5, t12);
    			append_dev(div1, t13);
    			append_dev(div1, span2);
    			append_dev(span2, p6);
    			append_dev(span2, t15);
    			append_dev(span2, p7);
    			append_dev(p7, t16);
    			append_dev(div1, t17);
    			append_dev(div1, span3);
    			append_dev(span3, p8);
    			append_dev(span3, t19);
    			append_dev(span3, p9);
    			append_dev(p9, t20);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*player*/ 1 && img.src !== (img_src_value = "https://minotar.net/helm/" + /*player*/ ctx[0].displayName + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*player*/ 1 && t1_value !== (t1_value = /*player*/ ctx[0].displayName + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*cssVars*/ 2) {
    				attr_dev(p0, "style", /*cssVars*/ ctx[1]);
    			}

    			if (dirty & /*player*/ 1 && t3_value !== (t3_value = ((/*player*/ ctx[0]?.guild?.tag?.text)
    			? `[${/*player*/ ctx[0].guild.tag.text}]`
    			: "") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*cssVars*/ 2) {
    				attr_dev(p1, "style", /*cssVars*/ ctx[1]);
    			}

    			if (dirty & /*player*/ 1 && hr_class_value !== (hr_class_value = "divider " + (/*player*/ ctx[0].displayName == "I_Like_Cats__"
    			? "dev"
    			: "default") + " svelte-xdly9k")) {
    				attr_dev(hr, "class", hr_class_value);
    			}

    			if (dirty & /*cssVars*/ 2) {
    				attr_dev(hr, "style", /*cssVars*/ ctx[1]);
    			}

    			if (dirty & /*player*/ 1 && t8_value !== (t8_value = /*player*/ ctx[0].level.toLocaleString() + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*player*/ 1 && t12_value !== (t12_value = (/*player*/ ctx[0].karma.toLocaleString() ?? 0) + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*player*/ 1 && t16_value !== (t16_value = /*player*/ ctx[0].friends.toLocaleString() + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*player*/ 1 && t20_value !== (t20_value = (capitalFirst(/*player*/ ctx[0]?.lastGame?.replace(/_/, " ")) ?? "Hidden") + "")) set_data_dev(t20, t20_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function capitalFirst(string) {
    	if (typeof string != "string") return string;
    	const lowercase = string.toLowerCase();
    	return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    }

    function getPlusColour(player) {
    	if (player?.rank?.type == "YOUTUBER") return "#FF5555";
    	if (player?.rank?.plus?.hex) return player.rank.plus.hex;
    	if (player?.rank?.type == "VIP+") return "#FFAA00";
    	return "#AAAAAA";
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let cssVars;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("UserProfile", slots, []);
    	let { player } = $$props;

    	let styles = {
    		rankColour: player?.rank?.rankColour,
    		plusColour: getPlusColour(player),
    		guildColour: player?.guild?.tag?.hex,
    		nameFontSize: (player?.guild?.tag) ? "24px" : "36px",
    		nameMarginTop: (player?.guild?.tag) ? "-5px" : "5px"
    	};

    	const writable_props = ["player"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<UserProfile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    	};

    	$$self.$capture_state = () => ({
    		player,
    		capitalFirst,
    		getPlusColour,
    		styles,
    		cssVars
    	});

    	$$self.$inject_state = $$props => {
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    		if ("styles" in $$props) $$invalidate(2, styles = $$props.styles);
    		if ("cssVars" in $$props) $$invalidate(1, cssVars = $$props.cssVars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, cssVars = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(";"));
    	return [player, cssVars];
    }

    class UserProfile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { player: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserProfile",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*player*/ ctx[0] === undefined && !("player" in props)) {
    			console.warn("<UserProfile> was created without expected prop 'player'");
    		}
    	}

    	get player() {
    		throw new Error("<UserProfile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set player(value) {
    		throw new Error("<UserProfile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.38.3 */

    const { Error: Error_1 } = globals;
    const file = "src\\App.svelte";

    // (51:4) {:catch error}
    function create_catch_block(ctx) {
    	let form;
    	let input;
    	let t0;
    	let h1;
    	let t2;
    	let p;
    	let t3_value = /*error*/ ctx[5] + "";
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Something went wrong :(";
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			attr_dev(input, "id", "username");
    			attr_dev(input, "name", "username");
    			input.value = "";
    			attr_dev(input, "placeholder", "Username");
    			input.required = true;
    			attr_dev(input, "class", "svelte-j2bz15");
    			add_location(input, file, 52, 12, 1679);
    			attr_dev(form, "class", "svelte-j2bz15");
    			add_location(form, file, 51, 8, 1625);
    			attr_dev(h1, "class", "svelte-j2bz15");
    			add_location(h1, file, 55, 8, 1785);
    			attr_dev(p, "class", "svelte-j2bz15");
    			add_location(p, file, 56, 8, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t3);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(getUser), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player*/ 1 && t3_value !== (t3_value = /*error*/ ctx[5] + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(51:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:then player}
    function create_then_block(ctx) {
    	let form;
    	let input;
    	let t;
    	let usercard;
    	let current;
    	let mounted;
    	let dispose;

    	usercard = new UserProfile({
    			props: { player: /*player*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t = space();
    			create_component(usercard.$$.fragment);
    			attr_dev(input, "id", "username");
    			attr_dev(input, "name", "username");
    			input.value = "";
    			attr_dev(input, "placeholder", "Username");
    			input.required = true;
    			attr_dev(input, "class", "svelte-j2bz15");
    			add_location(input, file, 46, 12, 1470);
    			attr_dev(form, "class", "svelte-j2bz15");
    			add_location(form, file, 45, 8, 1416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			insert_dev(target, t, anchor);
    			mount_component(usercard, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(getUser), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const usercard_changes = {};
    			if (dirty & /*player*/ 1) usercard_changes.player = /*player*/ ctx[0];
    			usercard.$set(usercard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usercard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usercard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t);
    			destroy_component(usercard, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(45:4) {:then player}",
    		ctx
    	});

    	return block;
    }

    // (42:19)          <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" alt="Loading" />         <h1>Fetching player data...</h1>     {:then player}
    function create_pending_block(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Fetching player data...";
    			if (img.src !== (img_src_value = "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			attr_dev(img, "class", "svelte-j2bz15");
    			add_location(img, file, 42, 8, 1261);
    			attr_dev(h1, "class", "svelte-j2bz15");
    			add_location(h1, file, 43, 8, 1356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(42:19)          <img src=\\\"https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif\\\" alt=\\\"Loading\\\" />         <h1>Fetching player data...</h1>     {:then player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link0;
    	let link1;
    	let t;
    	let main;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0,
    		error: 5,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*player*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t = space();
    			main = element("main");
    			info.block.c();
    			document.title = "HyAPI";
    			attr_dev(link0, "rel", "icon");
    			attr_dev(link0, "type", "image/png");
    			attr_dev(link0, "href", "../Assets/Logo.png");
    			attr_dev(link0, "class", "svelte-j2bz15");
    			add_location(link0, file, 36, 4, 1085);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "../Assets/stylesheet.css");
    			attr_dev(link1, "class", "svelte-j2bz15");
    			add_location(link1, file, 37, 4, 1152);
    			attr_dev(main, "class", "svelte-j2bz15");
    			add_location(main, file, 40, 0, 1226);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*player*/ 1 && promise !== (promise = /*player*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getUser(e) {
    	window.location = window.location.origin + `?name=${handleForm(e)}`;
    }

    function handleForm(e) {
    	const formDate = new FormData(e.target);
    	const data = {};

    	for (let field of formDate) {
    		const [key, value] = field;
    		data[key] = value;
    	}

    	return data.username;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const baseURL = new URL("https://hyapi.tech/api/");
    	const urlParams = new URLSearchParams(window.location.search);
    	const username = urlParams.get("name").toString() || "de_grote";
    	let player = fetchPlayer(username);

    	async function fetchPlayer(username) {
    		const res = await fetch(`${baseURL}player?name=${username}&key=temp-frontend&options=friends+guild`);

    		if (!res.ok) {
    			const json = await res.json();
    			throw new Error(json.error);
    		}

    		const json = await res.json();
    		$$invalidate(0, player = json);
    		return json;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		UserCard: UserProfile,
    		baseURL,
    		urlParams,
    		username,
    		player,
    		fetchPlayer,
    		getUser,
    		handleForm
    	});

    	$$self.$inject_state = $$props => {
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [player];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
